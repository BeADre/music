import {lazy, FC} from "react"

// hidden为true时为编程式导航
interface Router {
  path: string,
  component: FC,
  title: string,
  show?: boolean
}

const routerArr: Array<Router> = [
  {path: "/home", component: lazy(() => import("../pages/home")), title: "首页", show: true},
  // {path: "/singer", component: lazy(() => import("../pages/singer")), title: "歌手", show: true},
  // {path: "/newDisc", component: lazy(() => import("../pages/newDisc")), title: "新碟",show: true},
  // {path: "/rank", component: lazy(() => import("../pages/rank")), title: "排行榜",show: true},
  // {path: "/playlist", component: lazy(() => import("../pages/playlist")), title: "分类歌单",show: true},
  {path: "/mv", component: lazy(() => import("../pages/MV")), title: "MV"},
  {path: "/playMusic", component: lazy(() => import("../pages/play")), title: "播放页"},
  {path: "/search", component: lazy(() => import("../pages/search")), title: "搜索页"},
  {path: "*", component: lazy(() => import("../pages/notFind")), title: "404"},
];
export default routerArr
