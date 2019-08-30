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

export function getNewSongReq({limit,order,cat}) {
  const params = {
    type:cat
  }
  return axios.getData(API.homeApi.newSong,params)
}