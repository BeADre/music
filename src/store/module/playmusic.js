import {call, put} from "redux-saga/effects"
import {songDetailReq, getLyricReq} from "../../request/playmusic"

export default {
  state: {},
  effect: {
    * songDetail({payload}) {
      const data = yield call(songDetailReq, payload);
      if (data) {
        yield put({type: "playmusic/changeState", payload: {songDetail:data.data.songs[0]}});
      }
    },
    * getLyric({payload}) {
      const data = yield call(getLyricReq, payload);
      if (data) {
        yield put({type: "playmusic/changeState", payload: { lyric: data.data.lrc.lyric }});
      }
    },
  },
  reducer: {
    changeState(state, {payload}){
      return {...state, ...payload}
    },
  }
}
