import { axios } from "castle-haozijunqaq-utils"
import API from "./API"

axios.setBaseUrl("http://localhost:3000")

export function getPlaylistTabReq() {
  return axios.getData(API.homeApi.playlistTab)
}

export function getPlaylistReq({limit,order,cat}) {
  const params = {
    limit,
    order,
    cat
  }
  return axios.getData(API.homeApi.playlist,params)
}

export function getNewSongReq({cat}) {
  const params = {
    type:cat
  }
  return axios.getData(API.homeApi.newSong,params)
}

export function getNewPlateReq({offset, limit}) {
  const params = {
    offset,
    limit
  }
  return axios.getData(API.homeApi.newPlate, params)
}

export function getMvReq({cat}) {
  const params = {
    order:"最热",
    area: cat,
    limit:50
  }
  return axios.getData(API.homeApi.mv, params)
}


