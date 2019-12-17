import {combineReducers} from 'redux'
import storeModule from "./index"

const reducer = Object.keys(storeModule).reduce((reducerObj, moduleName) =>
  ({...reducerObj, ...storeModule[moduleName].reducer}), {});

export default combineReducers(reducer);
