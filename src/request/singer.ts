import axios from "./index"
import API from "./API"

export function hotSingerReq() {
  return axios.getData(API.singerApi.hotSinger, {offset: 0, limit: 50})
}

export function singerListReq(payload: any) {
  return axios.getData(API.singerApi.singer, {limit: 70, ...payload})
}


