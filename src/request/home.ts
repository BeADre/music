import axios from "./index"
import API from "./API"


type HomeParams = {
  limit: number,
  offset: number,
  order: string,
  cat: string,
  type: string,
  area: string,
}

export function getPlaylistTabReq() {
  return axios.get(API.homeApi.playlistTab)
}

export function getPlaylistReq({limit, order, cat}: Partial<HomeParams>) {
  const params = {
    limit,
    order,
    cat
  };
  return axios.get(API.homeApi.playlist, { params })
}

export function getNewSongReq({cat}: Partial<HomeParams>) {
  const params = {
    type: cat
  };
  return axios.get(API.homeApi.newSong, { params })
}

export function getNewPlateReq({type, limit}: Partial<HomeParams>) {
  const params = {
    limit,
    type
  };
  return axios.get(API.homeApi.newPlate, { params })
}

export function getMvReq({cat}: Partial<HomeParams>) {
  const params = {
    order: "最热",
    area: cat,
    limit: 10
  };
  return axios.get(API.homeApi.mv, { params })
}


