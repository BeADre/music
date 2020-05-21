import {call, put} from "redux-saga/effects"
import {getPlaylistTabReq, getPlaylistReq, getNewSongReq, getNewPlateReq, getMvReq} from "../../request/home"

export default {
  state: {},
  effect: {
    * getPlaylistTab() {
      const data = yield call(getPlaylistTabReq);
      if (data) {
        data.data.tags.unshift({name: "全部", id: "d_1"});
        yield put({type: "home/changeState", payload: {playTab: data.data.tags}});
      }
    },
    * getPlaylist({payload}: any) {
      const data = yield call(getPlaylistReq, payload);
      if (data) {
        yield put({type: "home/changeState", payload: {playlist: data.data.playlists}});
      }
    },
    * getNewSong({payload}: any) {
      const data = yield call(getNewSongReq, payload);
      if (data) {
        yield put({type: "home/changeState", payload: {newSong: data.data.data}});
      }
    },
    * getNewPlate({payload}: any) {
      const data = yield call(getNewPlateReq, payload);
      if (data) {
        yield put({type: "home/changeState", payload: {newPlate: data.data.albums}});
      }
    },
    * getMv({payload}: any) {
      const data = yield call(getMvReq, payload);
      if (data) {
        yield put({type: "home/changeState", payload: {mv: data.data.data}});
      }
    },

  },
  reducer: {
    changeState(state: any, {payload}: any) {
      return {...state, ...payload}
    },
  },
}

