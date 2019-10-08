import  axios  from "./index"
import API from "./API"

export function hotListReq() {
  return axios.getData(API.searchApi.hotList)
}
