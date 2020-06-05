import axios from "./index"
import API from "./API"

export function hotSingerReq() {
  const params = {offset: 0, limit: 50}
  return axios.get(API.singerApi.hotSinger, { params })
}

export function singerListReq(payload: any) {
  const params = {limit: 70, ...payload};
  return axios.get(API.singerApi.singer, { params })
}


