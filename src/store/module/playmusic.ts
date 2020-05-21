import {call, put} from "redux-saga/effects"
import {message} from "antd";
import { getDetailReq, getSongReq, getAlbumList} from "../../request/playmusic"

type Action = {
  type: string,
  payload: {
    id?: string,
    ids?: string
  },
  getDataTrick: Function
}

export default {
  state: {
    playlist: []
  },
  effect: {
    * getSong({payload, getDataTrick}: Action) {
      const data = yield call(getSongReq, payload);
      if (data) {
        if(data.data.urlData.playable){
          getDataTrick();
        }
        yield put({type: "playmusic/changeState", payload: {song: data.data}});
      }
    },
    * playlistDetail({payload, getDataTrick}: Action) {
      const data = yield call(getDetailReq, payload);
      if (data) {
        const playlist = data.data.playlist.tracks;
        if (playlist.length) {
          getDataTrick(playlist[0].id)
        } else {
          message.error("无法获取当前歌单歌曲")
        }
        yield put({type: "playmusic/changeState", payload: {playlist}});
      }
    },
    * albumList({payload, getDataTrick}: Action) {
      const data = yield call(getAlbumList, payload);
      if (data) {
        const playlist = data.data.songs;
        if (playlist.length) {
          getDataTrick(playlist[0].id)
        } else {
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
