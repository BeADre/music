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
      if (data && data.status === 200) {
        if(data.data.urlData.playable){
          getDataTrick();
        }else {
          getDataTrick();
          message.error("当前歌曲暂无版权")
        }
        yield put({type: "playmusic/changeState", payload: {song: data.data}});
      }else {
        message.error(data.statusText)
      }
    },
    * playlistDetail({payload, getDataTrick}: Action) {
      const data = yield call(getDetailReq, payload);
      if (data && data.status === 200) {
        const playlist = data.data.songs;
        if (playlist.length) {
          getDataTrick(playlist[0].id)
        } else {
          message.error("无法获取当前歌单歌曲")
        }
        yield put({type: "playmusic/changeState", payload: {playlist}});
      }else {
        message.error(data.statusText)
      }
    },
    * albumList({payload, getDataTrick}: Action) {
      const data = yield call(getAlbumList, payload);
      if (data && data.status === 200) {
        const playlist = data.data.songs;
        if (playlist.length) {
          getDataTrick(playlist[0].id)
        } else {
          message.error("无法获取当前歌单歌曲")
        }
        yield put({type: "playmusic/changeState", payload: {playlist}});
      }else {
        message.error(data.statusText)
      }
    }
  },
  reducer: {
    changeState(state: any, {payload}: any) {
      return {...state, ...payload}
    },
  }
}
