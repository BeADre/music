import  axios  from "./index"
import API from "./API"

export function hotListReq() {
  return axios.get(API.searchApi.hotList)
}

export function searchReq(data:any) {
  return axios.get(API.searchApi.search, { params: data })
}
