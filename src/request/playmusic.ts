import axios from "./index"
import API from "./API"

type Params = {
  ids: string,
  id: string
}

export function songDetailReq({ids}: Partial<Params>) {
  const params = {
    ids
  };
  return axios.getData(API.playMusicApi.songDetail, params)
}

export function getLyricReq({id}: Partial<Params>) {
  const params = {
    id
  };
  return axios.getData(API.playMusicApi.lyric, params)
}

export function getDetailReq({id}: Partial<Params>) {
  const params = {
    id
  };
  return axios.getData(API.playMusicApi.playlistDetail, params)
}

export function checkReq({id}: Partial<Params>) {
  const params = {
    id
  };
  return axios.getData(API.playMusicApi.checkMusic, params)
}




