# 渔屋

个人博客，基于开源博客主题 [Firefly](https://github.com/CuteLeaf/Firefly)（Astro 7 + Svelte 5，Fuwari 衍生分支）构建。

- 🎣 站点地址：<https://yuihoyo.top>
- 📦 仓库：记录站点配置与文章内容，主题本身的开发请前往上游仓库
- ☁️ 部署：Vercel / Cloudflare Workers（通过 `CF_WORKERS` 环境变量切换）

## 本地开发

```bash
pnpm install    # 安装依赖（强制使用 pnpm）
pnpm dev        # 启动本地开发服务器
pnpm build      # 生产构建（含 LQIP、字体子集、Pagefind 搜索索引）
pnpm new-post   # 新建文章
```

提交时 pre-commit 钩子会自动对暂存文件执行 Biome 格式化；更多协作约定见 [AGENTS.md](AGENTS.md)。

## 站内后台

站点内置写作后台（Sveltia CMS）：部署后访问 <https://yuihoyo.top/admin/>，使用 GitHub 登录即可在浏览器里写文章、拖拽上传图片，发布自动提交到本仓库并触发构建。后台为静态页（`public/admin/`），Sveltia 脚本自托管固定版本，升级方式见 [AGENTS.md](AGENTS.md)。

## 许可

主题代码遵循 [MIT](LICENSE) 协议；文章内容版权归站点所有。
