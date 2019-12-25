import {call, put} from "redux-saga/effects"
import {message} from "antd";
import {songDetailReq, getLyricReq, getDetailReq, checkReq} from "../../request/playmusic"

type Action = {
  type: string,
  payload: {
    id?: string,
    ids?: string
  }
  setState: Function
}

export default {
  state: {},
  effect: {
    * songDetail({payload}: Action) {
      const data = yield call(songDetailReq, payload);
      if (data) {
        yield put({type: "playmusic/changeState", payload: {songDetail: data.data.songs[0]}});
      }
    },
    * getLyric({payload}: Action) {
      const data = yield call(getLyricReq, payload);
      if (data) {
        yield put({type: "playmusic/changeState", payload: {lyric: data.data.lrc ? data.data.lrc.lyric : ""}});
      }
    },
    * check({payload, setState}: Action) {
      const data = yield call(checkReq, payload);
      if (data) {
        setState(data.data.success)
      }
    },
    * playlistDetail({payload, setState}: Action) {
      const data = yield call(getDetailReq, payload);
      if (data) {
        const playlist = data.data.playlist.tracks;
        if (playlist.length) {
          setState(playlist[0].id)
        }else {
          message.error("无法获取当前歌单歌曲")
        }
        yield put({type: "playmusic/changeState", payload: {playlist}});
      }
    }
  },
  reducer: {
    changeState(state: any, {payload}: any) {
      return {...state, ...payload}
    },
  }
}
