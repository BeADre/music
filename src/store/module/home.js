import {call, put} from "redux-saga/effects"
import {getPlaylistTabReq,getPlaylistReq,getNewSongReq,getNewPlateReq,getMvReq} from "../../request/home"

export default {
  state: {},
  effect: {
    *getPlaylistTab() {
      const data = yield call(getPlaylistTabReq);
      if (data) {
        data.data.tags.unshift({name:"",title:"全部"});
        yield put({type: "home/changeState", payload: {playTab:data.data.tags}});
      }
    },
    *getPlaylist({payload}) {
      const data = yield call(getPlaylistReq,payload);
      if (data) {
        yield put({type: "home/changeState", payload: {playlist:data.data.playlists}});
      }
    },
    *getNewSong({payload}) {
      const data = yield call(getNewSongReq,payload);
      if (data) {
        yield put({type: "home/changeState", payload: {newSong:data.data.data}});
      }
    },
    *getNewPlate({payload}) {
      const data = yield call(getNewPlateReq,payload);
      if (data) {
        yield put({type: "home/changeState", payload: {newPlate:data.data.albums}});
      }
    },
    *getMv({payload}) {
      const data = yield call(getMvReq,payload);
      if (data) {
        yield put({type: "home/changeState", payload: {mv:data.data.data}});
      }
    },

  },
  reducer: {
    changeState(state, {payload}){
      return {...state, ...payload}
    },
  },
}

