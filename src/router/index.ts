import {lazy, FC} from "react"

// hidden为true时为编程式导航
interface Router {
  path: string,
  component: FC,
  title: string,
  hidden?: boolean
}

const routerArr: Array<Router> = [
  {path: "/home", component: lazy(() => import("../pages/home")), title: "首页"},
  {path: "/singer", component: lazy(() => import("../pages/singer")), title: "歌手"},
  // {path: "/newDisc", component: lazy(() => import("../pages/newDisc")), title: "新碟"},
  // {path: "/rank", component: lazy(() => import("../pages/rank")), title: "排行榜"},
  // {path: "/playlist", component: lazy(() => import("../pages/playlist")), title: "分类歌单"},
  {path: "/mv", component: lazy(() => import("../pages/MV")), title: "MV", hidden: true},
  {path: "/playMusic", component: lazy(() => import("../pages/play")), title: "播放页", hidden: true},
  {path: "/search", component: lazy(() => import("../pages/search")), title: "搜索页", hidden: true},
];
export default routerArr
