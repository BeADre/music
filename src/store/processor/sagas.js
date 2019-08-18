import {all} from "redux-saga/effects"
import sagaModule from "./index"


const saga = Object.keys(sagaModule).reduce((effectArr,moduleName) => {
  const singleModuleEffectArr = sagaModule[moduleName].effect;
  return [...effectArr,...singleModuleEffectArr];
},[]);

export default function* rootSaga() {
  yield all(saga);
}