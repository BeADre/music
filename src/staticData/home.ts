import InterfaceTab from "./interfaceTab"

enum Tab {
  全部 = 0,
  港台 = 3,
  华语 = 7,
  日本 = 8,
  韩国 = 16,
  欧美 = 96,
}

export const newSongTab: Array<InterfaceTab> = [
  {name: Tab[0], id: Tab["全部"]},
  {name: Tab[7], id: Tab["华语"]},
  {name: Tab[96], id: Tab["欧美"]},
  {name: Tab[8], id: Tab["日本"]},
  {name: Tab[16], id: Tab["韩国"]},
];

export const albumTab: Array<InterfaceTab> = [
  {name: '全部', id: 'ALL'},
  {name: '华语', id: 'ZH'},
  {name: '欧美', id: 'EA'},
  {name: '日本', id: 'JP'},
  {name: '韩国', id: 'KR'},
];

export const mvTab: Array<InterfaceTab> = [
  {name: Tab[0], id: Tab["全部"]},
  {name: Tab[3], id: Tab["港台"]},
  {name: Tab[7], id: Tab["华语"]},
  {name: Tab[96], id: Tab["欧美"]},
  {name: Tab[8], id: Tab["日本"]},
  {name: Tab[16], id: Tab["韩国"]},
];

