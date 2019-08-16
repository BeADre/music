// import test from "../../request/test"
import {sagaAction} from "../actions"
import {call, put,takeEvery} from "redux-saga/effects"

export function* testSaga() {
  yield takeEvery(sagaAction.FIRST_ACTION_SAGA, function* () {
    try {
      const data = yield call(test);
      let { length } = data.data.reviewData
      yield put({
        type:"FIRST_ACTION_REDUCER",
        length
      })
    }catch (e) {

    }
  })
}
