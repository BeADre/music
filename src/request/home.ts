import axios from "./index"
import API from "./API"


export function getPlaylistTabReq() {
  return axios.getData(API.homeApi.playlistTab)
}

export function getPlaylistReq({limit, order, cat}: any) {
  const params = {
    limit,
    order,
    cat
  };
  return axios.getData(API.homeApi.playlist, params)
}

export function getNewSongReq({cat}: any) {
  const params = {
    type: cat
  };
  return axios.getData(API.homeApi.newSong, params)
}

export function getNewPlateReq({offset, limit}: any) {
  const params = {
    offset,
    limit
  };
  return axios.getData(API.homeApi.newPlate, params)
}

export function getMvReq({cat}: any) {
  const params = {
    order: "最热",
    area: cat,
    limit: 50
  };
  return axios.getData(API.homeApi.mv, params)
}


