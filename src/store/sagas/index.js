// import test from "../../request/test"
import {sagaAction} from "../actions/home"
import {call, put,takeEvery} from "redux-saga/effects"


// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

// var imagesContext = require.context('./store/actions/', false, /\.js$/);
// console.log(imagesContext(imagesContext.keys()[0]))

const modulesFiles = require.context('../actions/', false, /\.js$/);
const sagaModule = modulesFiles.keys().reduce((accumulator,filename) => {
  const funcName = filename.replace(/^\.\/(.*)\.\w+$/, '$1')
  const sagaAction = modulesFiles(filename)
},{})

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
