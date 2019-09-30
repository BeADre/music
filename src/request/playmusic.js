import  axios  from "./index"
import API from "./API"


export function songDetailReq({ids}) {
  const params = {
    ids
  }
  return axios.getData(API.playMusicApi.songDetail,params)
}

export function getLyricReq({id}) {
  const params = {
    id
  }
  return axios.getData(API.playMusicApi.lyric,params)
}




