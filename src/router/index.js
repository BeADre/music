import Home from "../pages/home"
import singer from "../pages/singer"
import newDisc from "../pages/newDisc"
import rank from "../pages/rank"
import playlist from "../pages/playlist"
import radio from "../pages/radio"
import MV from "../pages/MV"
import album from "../pages/album"
import play from "../pages/play"
import search from "../pages/search"

export default [
  {path:"/home",component: Home, title: "首页"},
  {path:"/singer",component: singer, title: "歌手"},
  {path:"/newDisc",component: newDisc, title: "新碟"},
  {path:"/rank",component: rank, title: "排行榜"},
  {path:"/playlist",component: playlist, title: "分类歌单"},
  {path:"/radio",component: radio, title: "电台"},
  {path:"/MV",component: MV, title: "MV"},
  {path:"/album",component: album, title: "数字专辑"},
  {path:"/playMusic",component: play, title: "播放页", hidden:true},
  {path:"/search",component: search, title: "搜索页", hidden:true},
]
