import {call, put} from "redux-saga/effects"
import {hotListReq, searchReq} from "../../request/search"

export default {
  state: {
    pagination: {
      showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
    },
    isLoading: false
  },
  effect: {
    * hotList() {
      const data = yield call(hotListReq);
      if (data) {
        const {hots = []} = data.data.result;
        yield put({type: "search/changeState", payload: {hots}});
      }
    },
    * search({payload}: any) {
      yield put({type: "search/changeState", payload: {isLoading: true}});
      const data = yield call(searchReq, payload);
      let dataName: string = "";
      let countName: string = "";
      switch (payload.type) {
        case 1 :
          dataName = "songs";
          countName = "songCount";
          break;
        case 10:
          dataName = "albums";
          countName = "albumCount";
          break;
        case 1000:
          dataName = "playlists";
          countName = "playlistCount";
          break;
        case 1004:
          dataName = "mvs";
          countName = "mvCount";
          break
      }
      if (data) {
        yield put({
          type: "search/search_Reducer",
          payload: {
            list: data.data.result[dataName],
            pagination: {
              current: payload.offset + 1 || 1,
              pageSize: payload.limit || 10,
              total: data.data.result[countName],
            }
          }
        });
        yield put({type: "search/changeState", payload: {isLoading: false}});
      }
    },
  },
  reducer: {
    changeState(state: any, {payload}: any) {
      return {...state, ...payload}
    },
    search_Reducer(state: any, {payload}: any) {
      const {list, pagination} = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },

  }
}
