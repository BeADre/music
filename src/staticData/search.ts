import InterfaceTab from "./interfaceTab"

enum Tab {
  单曲 = 1,
  专辑 = 10,
  歌单 = 1000,
  MV = 1004
}

export const searchTab: Array<InterfaceTab> = [
  {name: Tab[1], id: Tab["单曲"]},
  {name: Tab[10], id: Tab["专辑"]},
  {name: Tab[1000], id: Tab["歌单"]},
  {name: Tab[1004], id: Tab["MV"]},
];

