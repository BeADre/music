import  axios  from "./index"
import API from "./API"

export function hotListReq() {
  return axios.getData(API.searchApi.hotList)
}

export function searchReq(data:any) {
  return axios.getData(API.searchApi.search,data)
}
