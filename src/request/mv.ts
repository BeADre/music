import axios from "./index"
import API from "./API"

type Payload = {
  mvid: number
}

export function getDetailReq(payload: Payload) {
  return axios.getData(API.mvApi.mvDetail, payload)
}


