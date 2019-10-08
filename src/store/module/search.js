import {call, put} from "redux-saga/effects"
import {hotListReq} from "../../request/search"

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
  },
  effect: {
    * hotList() {
      const data = yield call(hotListReq);
      if (data) {
        const { hots = [] } = data.data.result;
        yield put({type: "search/hotList_Reducer", payload: {hots}});
      }
    },
  },
  reducer: {
    hotList_Reducer(state, {payload}) {
      return {...state, ...payload}
    },

  }
}
