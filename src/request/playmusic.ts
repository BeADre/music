import axios from "./index"
import API from "./API"

type Params = {
  ids: string,
  id: string
}


export function getDetailReq({id}: Partial<Params>) {
  const params = {
    id
  };
  return axios.getData(API.playMusicApi.playlistDetail, params)
}

export function getSongReq({id}: Partial<Params>) {
  const params = {
    id
  };
  return axios.getData(API.playMusicApi.getSong, params)
}

export function getAlbumList({id}: Partial<Params>) {
  const params = {
    id
  };
  return axios.getData(API.playMusicApi.albumList, params)
}




