import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	// 是否在导航栏显示音乐播放器入口
	showInNavbar: true,

	// 是否在侧边栏显示音乐播放器组件
	showInSidebar: true,

	// 使用方式："meting" 使用 Meting API，"local" 使用本地音乐列表
	// 本地歌曲由站点自身 CDN 分发，避免海外访问网易 CDN 缓慢；切回在线歌单改回 "meting" 即可
	mode: "local",

	// 默认音量 (0-1)
	volume: 0.1,

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode: "list",

	// 是否显启用歌词
	showLyrics: true,

	// Meting API 配置
	meting: {
		// Meting API 地址
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server: "netease",
		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type: "album",
		// 歌单/专辑/单曲 ID 或搜索关键词
		id: "97767168",
		// 认证 token（可选）
		auth: "",
		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// 本地音乐配置（当 mode 为 'local' 时使用）
	// 1. 支持传入歌词文件的路径
	// lrc: "/assets/music/lrc/使一颗心免于哀伤-哼唱.lrc",
	// 2. 或者直接填入歌词字符串内容
	// lrc: "[00:00.00]歌词内容...",
	local: {
		playlist: [
			{
				name: "璃月 Liyue",
				artist: "陈致逸 / HOYO-MiX",
				url: "/assets/music/陈致逸-HOYO-MiX-璃月-Liyue.mp3",
				cover: "/assets/music/cover/陈致逸-HOYO-MiX-璃月-Liyue.webp",
				lrc: "/assets/music/lrc/陈致逸-HOYO-MiX-璃月-Liyue.lrc",
			},
			{
				name: "使一颗心免于哀伤",
				artist: "知更鸟 / HOYO-MiX / Chevy",
				url: "/assets/music/使一颗心免于哀伤-哼唱.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "多远都要在一起",
				artist: "G.E.M. 邓紫棋",
				url: "/assets/music/G.E.M.邓紫棋-多远都要在一起.mp3",
				cover: "/assets/music/cover/G.E.M.邓紫棋-多远都要在一起.webp",
				lrc: "/assets/music/lrc/G.E.M.邓紫棋-多远都要在一起.lrc",
			},
			{
				name: "你是永远的盛夏",
				artist: "Youzee Music",
				url: "/assets/music/Youzee-Music-你是永远的盛夏.mp3",
				cover: "/assets/music/cover/Youzee-Music-你是永远的盛夏.webp",
				lrc: "/assets/music/lrc/Youzee-Music-你是永远的盛夏.lrc",
			},
			{
				name: "唯一",
				artist: "告五人",
				url: "/assets/music/告五人-唯一.mp3",
				cover: "/assets/music/cover/告五人-唯一.webp",
				lrc: "/assets/music/lrc/告五人-唯一.lrc",
			},
			{
				name: "我怀念的",
				artist: "孙燕姿",
				url: "/assets/music/孙燕姿-我怀念的.mp3",
				cover: "/assets/music/cover/孙燕姿-我怀念的.webp",
				lrc: "/assets/music/lrc/孙燕姿-我怀念的.lrc",
			},
			{
				name: "皎洁的笑颜 Moonlike Smile",
				artist: "陈致逸 / HOYO-MiX",
				url: "/assets/music/陈致逸-HOYO-MiX-皎洁的笑颜-Moonlike-Smile.mp3",
				cover: "/assets/music/cover/陈致逸-HOYO-MiX-皎洁的笑颜-Moonlike-Smile.webp",
				lrc: "/assets/music/lrc/陈致逸-HOYO-MiX-皎洁的笑颜-Moonlike-Smile.lrc",
			},
		],
	},
};
