import axios from "./index"
import API from "./API"

export function hotSingerReq(payload) {
  return axios.getData(API.singerApi.hotSinger, {offset: 0, limit: 50, ...payload})
}

export function singerListReq(payload) {
  return axios.getData(API.singerApi.singer, {limit: 70, ...payload})
}


