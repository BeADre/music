import axios from "./index"
import API from "./API"


export function songDetailReq({ids}: any) {
  const params = {
    ids
  };
  return axios.getData(API.playMusicApi.songDetail, params)
}

export function getLyricReq({id}: any) {
  const params = {
    id
  };
  return axios.getData(API.playMusicApi.lyric, params)
}




