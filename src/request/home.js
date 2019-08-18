import { axios } from "castle-haozijunqaq-utils"
import API from "./API"

axios.setBaseUrl("http://localhost:3000")

export function getPlaylistTabReq() {
  return axios.getData(API.homeApi.playlistTab)
}

export function getPlaylistReq({cat}) {
  const params = {
    limit: 10,
    order:"hot",
    cat
  }
  return axios.getData(API.homeApi.playlist,params)
}