import {call, put} from "redux-saga/effects"
import {getPlaylistTabReq,getPlaylistReq} from "../../request/home"


export default {
  state: {},
  effect: {
    getPlaylistTab: function* () {
      const data = yield call(getPlaylistTabReq)
      if (data) {
        data.data.tags.unshift({name:"",title:"全部"})
        yield put({type: "home/getPlaylistTab_Reducer", payload: {playTab:data.data.tags}});
      }
    },
    getPlaylist: function* ({payload}) {
      const data = yield call(getPlaylistReq,payload)
      if (data) {
        yield put({type: "home/getPlaylist_Reducer", payload: {playlist:data.data.playlists}})
      }
    }
  },
  reducer: {
    getPlaylistTab_Reducer(state, {payload}) {
      return {...state, ...payload}
    },

    getPlaylist_Reducer(state, {payload}) {
      return {...state, ...payload}
    }
  },
}

