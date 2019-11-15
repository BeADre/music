import  axios  from "./index"
import API from "./API"

export function hotSingerReq() {
  return axios.getData(API.singerApi.singerApi)
}


