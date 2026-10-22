# 上游主题同步手册

本仓库基于 [CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly) 二次开发。本文记录与上游保持同步的完整流程，以及 2026-10-22 那次"历史分叉修复 + 大版本同步"的处置记录。

## 一、仓库关系

| 远程 | 地址 | 说明 |
|---|---|---|
| `origin` | `x1ao-yu/blog` | 自己的仓库，日常 push 目标 |
| `upstream` | `CuteLeaf/Firefly` | 上游主题，**默认分支是 `master`，不是 `main`** |

```bash
git remote -v
git fetch upstream --prune
```

## 二、同步前自检

```bash
git status --short                 # 必须干净，否则先 commit 或 stash
git fetch upstream --prune
git log -1 --format='%h %s' upstream/master        # 上游最新
git merge-base HEAD upstream/master                # 合并基线
git rev-list --left-right --count upstream/master...HEAD   # 左=上游独有 右=本地独有
```

**基线判断（最关键）**：`git merge-base` 的输出必须是上游历史里的某个提交（即 `git log --format=%H upstream/master | grep <base>` 能命中）。若基线停在 `first commit` 这种远古提交，说明本地历史被重写过，直接 merge 会重放全部上游历史 → 走第四节的"基线修复"。

## 三、常规同步流程（基线正常时）

```bash
# 1) 开同步分支，别直接在 main 上做
git switch -c sync/upstream-<目标版本>

# 2) 合并上游
git merge upstream/master

# 3) 处理冲突（见第五节规则表）

# 4) 验证
npm_config_manage_package_manager_versions=false pnpm install    # 锁文件变了才需要
npm_config_manage_package_manager_versions=false pnpm type-check
npm_config_manage_package_manager_versions=false pnpm check
CODEBUDDY_SAFE_DELETE_ENABLED=0 npm_config_manage_package_manager_versions=false pnpm build
npm_config_manage_package_manager_versions=false pnpm dev       # 目视检查首页/文章/相册/后台

# 5) 合回 main（sync 分支总是从 main 长出，可 fast-forward）
git switch main && git merge --ff-only sync/upstream-<目标版本>
```

> `npm_config_manage_package_manager_versions=false` 不能省：本机 pnpm 11.x 在 Windows 上 link 阶段不落盘（见 `.workbuddy/memory` 2026-10-22 记录），必须用全局 pnpm 10 安装。

## 四、基线修复（历史被重写时，仅需一次）

原理：找到"本地某个提交，其 tree（内容快照）与上游某个提交逐字节一致"，用 `git replace --graft` 把这个本地提交的父提交临时改写成那个上游提交。只改历史视图，不动任何文件内容。

```bash
# 1) 找出上游对应版本的提交（例：6.16.4）
git log --oneline --format='%h %ad %s' --date=short -20 upstream/master

# 2) 取它的 tree id
git rev-parse a33f9d18^{tree}

# 3) 在本地找 tree 相同的提交（秒出，别写 while 循环，1400+ 次 rev-parse 很慢）
git log --format='%H %T' HEAD | grep -m1 <tree-id>

# 4) 打补丁：把本地锚点的父提交改成上游锚点
git replace --graft <本地锚点> a33f9d18

# 5) 验证基线已变
git merge-base HEAD upstream/master      # 应输出 a33f9d18...

# 6) 正常合并
git switch -c sync/upstream-<版本>
git merge upstream/master

# 7) 合并完成、提交后清理临时引用（一定要清，否则以后每次操作都带着这层替换）
git replace -d <本地锚点>
git replace -l                            # 应为空
```

清理后 `upstream/master` 已成为本地提交的祖先，**此后永久走第三节的常规流程**。

## 五、冲突处置规则（优先级从高到低）

| 冲突文件 | 处置 | 命令 |
|---|---|---|
| 已删除的上游示例文章 / 多语言 README / docs | 保持删除 | `git rm <file>` |
| `README.md`、`biome.json` | 保留本地 | `git checkout --ours` |
| `src/config/siteConfig.ts`、`profileConfig.ts`、`navBarConfig.ts` | **手工合并**：留本站身份信息，吸收上游新增字段 | 手工 |
| `src/components/layout/Footer.astro` | 取上游后**必须补回**自定义内容（Cloudflare 徽标、`FooterConfig.html`） | `--theirs` + 手改 |
| `src/content.config.ts` | 手工合并：本地 `gallery` + 上游 `projects` 等集合都要留 | 手工 |
| `pnpm-lock.yaml` | 不要手解，见第六节重新生成 | — |
| `src/constants/lqips.json` | 任取一侧，`pnpm build` 会重写 | — |
| `src/content/posts/*.md` | 保留本地（上游是演示文章） | `--ours` |

**`package.json` 特殊**：不能整份取上游 —— 本地常有一批依赖比上游新（上游发版节奏慢于本站升级），照搬等于降级。做法是"取高版本 + 补齐上游新增 + 移除上游已弃用"：

```bash
node -e "
const fs=require('fs');
const local=JSON.parse(fs.readFileSync('package.json','utf8'));
const up=JSON.parse(require('child_process').execSync('git show upstream/master:package.json','utf8'));
const ver=v=>{const m=String(v).match(/(\d+)\.(\d+)\.(\d+)/);return m?m.slice(1).map(Number):[0,0,0];};
const gt=(x,y)=>{const a=ver(x),c=ver(y);for(let i=0;i<3;i++){if(a[i]>c[i])return true;if(a[i]<c[i])return false;}return false;};
const out={...local, version:up.version};
out.scripts={...local.scripts, build:up.scripts.build};
for(const sec of ['dependencies','devDependencies']){
  const L={...(local[sec]||{})};
  for(const [n,v] of Object.entries(up[sec]||{})){
    if(!(n in L)) L[n]=v; else if(gt(v,L[n])) L[n]=v;
  }
  out[sec]=Object.fromEntries(Object.entries(L).sort(([a],[b])=>a.localeCompare(b)));
}
fs.writeFileSync('package.json', JSON.stringify(out,null,'\t')+'\n');
"
```

## 六、锁文件：pnpm 11 的 24 小时供应链策略（踩过的坑）

**现象**：本地 `pnpm install` 正常，CI 上 `pnpm install --frozen-lockfile` 直接失败：

```
The lockfile contains entries that the active policies reject.
  rolldown@1.2.15 was published at 2026-10-21T13:08:47Z, within the minimumReleaseAge cutoff
```

**原因**：pnpm 11 默认带 `minimumReleaseAge=1440`（24 小时）供应链保护，pnpm 10 不强制。本机用 pnpm 10 重解锁文件时会选中当天刚发布的版本，于是锁文件"污染"，CI 用 pnpm 11 一读就炸。

**正确做法** —— 必须在**没有 `node_modules` 的干净目录**里用 pnpm 11 解析：

```bash
TMPD="/c/Users/Www/AppData/Local/Temp/citest-$$"
mkdir -p "$TMPD"
cp package.json pnpm-lock.yaml pnpm-workspace.yaml "$TMPD"/    # pnpm-workspace.yaml 不能漏，overrides 在里面
cd "$TMPD"
npx -y pnpm@11.22.0 install --lockfile-only --ignore-scripts
cp pnpm-lock.yaml "D:/HelloWorld/Astro/my blog/pnpm-lock.yaml"
```

> 在仓库目录里删锁重解**无效**：pnpm 会复用 `node_modules` 里已装的版本，照样选出被策略拒绝的那一个。

改完锁文件先在干净目录模拟 CI：

```bash
cp package.json pnpm-lock.yaml pnpm-workspace.yaml "$TMPD2"/
cd "$TMPD2" && npx -y pnpm@11.22.0 install --frozen-lockfile --ignore-scripts
```

## 七、2026-10-22 同步记录（6.16.4 → 6.16.8）

- **历史状态**：本地与上游共享祖先仍停在 `f456ab77`（2025-10-11 first commit），各有 1426 / 1439 个提交，其中 1371 个提交标题相同但 SHA 不同 → 历史被重写过。
- **基线修复**：上游 `a33f9d18`（`chore: 更新版本号至 6.16.4`，2026-08-22）的 tree = `3bdabc9a...`，与本地提交 `8c907844` 完全一致；`git replace --graft 8c907844 a33f9d18` 后基线正确。
- **同步量**：69 个提交 / 172 个文件；冲突 28 个（17 个是"已删除 vs 上游改过"，11 个内容冲突）。
- **合并提交**：`57d6bd48`（parents: `b21a73c2` + `91cbbefe`）；随后 `git replace -d` 清理，当前 `merge-base(HEAD, upstream/master) = 91cbbefe`。
- **上游带来的能力**：项目展示页 `/projects`、Atom 订阅、`llms.txt`、系列导航、沉浸式阅读、样式按页拆分、Pagefind 路径修复（Cloudflare Pages 搜索 404）、OG 图改用本地中文字体（去掉构建期 Google Fonts 请求）。
- **上游删除的文件**：`src/config/footerConfig.ts`、`src/types/footerConfig.ts`、`src/styles/widget-responsive.css`（页脚改读 `src/config/FooterConfig.html`）。
- **教训**：取上游版 `Footer.astro` 时把自定义的 Cloudflare 徽标覆盖掉了 —— 所有"框架组件但被手工改过"的文件，取上游后必须人工回填。
- **备份分支**：`backup/pre-upstream-sync-20261022`（= 合并前 `b21a73c2`）。确认稳定后可删。

## 八、排错

| 症状 | 原因 / 处理 |
|---|---|
| merge 时出现上千个冲突 | 基线错了，回到第四节做 graft |
| `pnpm install` 后 `node_modules/.bin` 为空、`astro` 找不到 | pnpm 11 在本机 link 失效，改用 `npm_config_manage_package_manager_versions=false pnpm install --frozen-lockfile` |
| `pnpm build` 末段被 safe-delete 护栏中断 | Astro 清 `dist/.prerender`/`.vite` 触发批量删除阈值，加 `CODEBUDDY_SAFE_DELETE_ENABLED=0` |
| `astro check` 报 `ContentCollection` 类型不存在 | 集合配置改了之后没同步类型，跑 `npx astro sync` |
| 评论区样式全乱 | Twikoo 前端版本变动，见 `src/config/commentConfig.ts` 的版本注释与 `public/assets/css/twikoo-custom.css` |
