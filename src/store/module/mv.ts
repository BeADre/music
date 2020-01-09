import {call, put} from "redux-saga/effects"
import {getDetailReq} from "../../request/mv"

type Payload = {
  payload: {
    mvid: number
  }
}

export default {
  state: {
  },
  effect: {
    * getDetail({payload}: Payload) {
      const data = yield call(getDetailReq, payload);
      if (data) {
        yield put({type: "mv/changeState", payload: {mvDetail: data.data.data}});
      }
    },
  },
  reducer: {
    changeState(state: any, {payload}: any) {
      return {...state, ...payload}
    },
  }
}
