import {all} from "redux-saga/effects"
import storeModule from "./index"

// 取出所有的saga将其一并注册
const saga = Object.keys(storeModule).reduce((effectArr,moduleName) => {
  const singleModuleEffectArr = storeModule[moduleName].effect;
  return [...effectArr,...singleModuleEffectArr];
},[]);

export default function* rootSaga() {
  yield all(saga);
}
