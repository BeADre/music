import {call, put} from "redux-saga/effects";
import {hotSingerReq, singerListReq} from "../../request/singer";

export default {
  state: {},
  effect: {
    * hotSinger() {
      const data = yield call(hotSingerReq);
      if (data) {
        const {artists: hotSinger = []} = data.data;
        yield put({
          type: "singer/changeState",
          payload: {
            hotSinger
          }
        });
      }
    },
    * singerList({payload}:any) {
      const data = yield call(singerListReq, payload);
      if (data) {
        yield put({
          type: "singer/changeState",
          payload: {
            list: data.data.artists,
          }
        });
      }
    },
  },
  reducer: {
    changeState(state:any, {payload}:any) {
      return {...state, ...payload}
    },
  }
}
