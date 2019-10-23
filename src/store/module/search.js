import {call, put} from "redux-saga/effects"
import {hotListReq,searchReq} from "../../request/search"

export default {
  state: {
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 20,
    },
    isLoading: false
  },
  effect: {
    * hotList() {
      const data = yield call(hotListReq);
      if (data) {
        const { hots = [] } = data.data.result;
        yield put({type: "search/changeState", payload: {hots}});
      }
    },
    * search({payload}) {
      yield put({type:"search/changeState", payload:{isLoading: true }});
      const data = yield call(searchReq, payload);
      if (data) {
        yield put({
          type: "search/search_Reducer",
          payload: {
            list: data.data.result.songs,
            pagination: {
              current: payload.offset + 1 || 1,
              pageSize:payload.limit || 20,
              total: data.data.result.songCount,
            }
          }
        });
        yield put({type:"search/changeLoading", payload:{isLoading: false }});
      }
    },
  },
  reducer: {
    changeState(state, {payload}){
      return {...state, ...payload}
    },
    search_Reducer(state, {payload}) {
      const { list, pagination } = payload
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
