import {call, put} from "redux-saga/effects"
import {getPlaylistTabReq,getPlaylistReq,getNewSongReq,getNewPlateReq,getMvReq} from "../../request/home"


export default {
  state: {},
  effect: {
    *getPlaylistTab() {
      const data = yield call(getPlaylistTabReq);
      if (data) {
        data.data.tags.unshift({name:"",title:"全部"});
        yield put({type: "home/getPlaylistTab_Reducer", payload: {playTab:data.data.tags}});
      }
    },
    *getPlaylist({payload}) {
      const data = yield call(getPlaylistReq,payload);
      if (data) {
        yield put({type: "home/getPlaylist_Reducer", payload: {playlist:data.data.playlists}});
      }
    },
    *getNewSong({payload}) {
      const data = yield call(getNewSongReq,payload);
      if (data) {
        yield put({type: "home/getNewSong_Reducer", payload: {newSong:data.data.data}});
      }
    },
    *getNewPlate({payload}) {
      const data = yield call(getNewPlateReq,payload);
      if (data) {
        yield put({type: "home/getNewPlate_Reducer", payload: {newPlate:data.data.albums}});
      }
    },
    *getMv({payload}) {
      const data = yield call(getMvReq,payload);
      if (data) {
        yield put({type: "home/getMv_Reducer", payload: {mv:data.data.data}});
      }
    },

  },
  reducer: {

    getPlaylistTab_Reducer(state, {payload}) {
      return {...state, ...payload}
    },

    getPlaylist_Reducer(state, {payload}) {
      return {...state, ...payload}
    },

    getNewSong_Reducer(state, {payload}) {
      return {...state, ...payload}
    },

    getNewPlate_Reducer(state, {payload}) {
      return {...state, ...payload}
    },

    getMv_Reducer(state, {payload}) {
      return {...state, ...payload}
    },
  },
}

