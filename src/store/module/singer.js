import {call, put} from "redux-saga/effects"
import {hotSingerReq} from "../../request/singer";


export default {
  state: {
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
    },
    isLoading: false
  },
  effect: {
    * hotSinger() {
      const data = yield call(hotSingerReq);
      if (data) {
        const { hots = [] } = data.data.result;
        yield put({type: "singer/changeState", payload: {hots}});
      }
    },
  },
  reducer: {
    changeState(state, {payload}){
      return {...state, ...payload}
    },
    singer_Reducer(state, {payload}) {
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
