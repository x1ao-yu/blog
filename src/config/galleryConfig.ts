import type { GalleryConfig } from "@/types/galleryConfig";

// 相册配置
// 相册元数据已迁移为内容集合：src/content/gallery/<相册id>.md（在站内后台「相册」中管理）
// 照片放在 public/gallery/<相册id>/ 目录（后台相册编辑器内可拖拽上传，或用 urls.txt 配置远程图片）
export const galleryConfig: GalleryConfig = {
	// 瀑布流最小列宽(px)，浏览器根据容器宽度自动计算列数，默认 240
	// 值越小列数越多，值越大列数越少
	columnWidth: 240,
};
