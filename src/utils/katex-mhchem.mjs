// KaTeX + mhchem 化学扩展统一入口
// 根因说明：rehype-katex 7.x 内部直接 `import katex from 'katex'`，
// 完全忽略配置中传入的 { katex } 选项。此前它依赖解析到 katex 0.16.x，
// 与项目根的 0.18.x 是两个不同实例，mhchem 注册到了没人使用的那份上，
// 导致 \ce 渲染报错（红色 errorColor 文本）。
// 修复：pnpm-workspace.yaml 中 overrides 将 katex 统一为 ^0.18.4，
// 使 rehype-katex 与本项目共享同一实例；本文件用显式 ESM 深路径导入，
// 避免配置打包时 CJS/ESM 双实例风险，并在加载时注册 mhchem 扩展。
import katex from "katex/dist/katex.mjs";
import "katex/dist/contrib/mhchem.mjs";

export default katex;
