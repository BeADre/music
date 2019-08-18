import {combineReducers} from 'redux'
import sagaModule from "./index"


const reducer = Object.keys(sagaModule).reduce((reducerObj, moduleName) =>
  ({...reducerObj, ...sagaModule[moduleName].reducer}), {});

export default combineReducers(reducer);