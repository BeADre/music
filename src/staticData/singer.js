export const letterArr = function () {
  let count1 = 0
  const arr = []

  for (let i = 65; i < 91; i++) {
    arr.push(String.fromCharCode(i))
    count1++
  }
  return arr
}

export const playerTab = [
  {name: "华语男歌手", id: 1001},
  {name: "华语女歌手", id: 1002},
  {name: "华语组合", id: 1003},
  {name: "欧美男歌手", id: 2001},
  {name: "欧美女歌手", id: 2002},
  {name: "欧美组合", id: 2003},
  {name: "日本男歌手", id: 6001},
  {name: "日本女歌手", id: 6002},
  {name: "日本组合", id: 6003},
  {name: "韩国男歌手", id: 7001},
  {name: "韩国女歌手", id: 7002},
  {name: "韩国组合", id: 7003},
  {name: "其他男歌手", id: 4001},
  {name: "其他女歌手", id: 4002},
  {name: "其他组合", id: 4003},
  {name: "入驻歌手", id: 5001},
]
