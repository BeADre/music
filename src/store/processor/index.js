import {takeEvery} from "redux-saga/effects";

const modulesFiles = require.context("../module/", false, /\.js$/);
const sagaModule = modulesFiles.keys().reduce((accumulator, filename) => {
  const moduleName = filename.replace(/^\.\/(.*)\.\w+$/, '$1');
  const sagaAction = modulesFiles(filename);
  accumulator[moduleName] = sagaAction.default;
  return accumulator;
}, {});


Object.keys(sagaModule).forEach(value => {
  const initState = sagaModule[value].state;
  const effect = Object.keys(sagaModule[value].effect).reduce((effectObj, funcName) => {
      return [...effectObj, ...[takeEvery(`${value}/${funcName}`, sagaModule[value].effect[funcName])]]
  }, []);

  const reducer = {};
  const reducerObj = sagaModule[value].reducer
  const reducerNameArr = Object.keys(reducerObj);
  reducer[value] = function (state = initState, action) {
    for (let i = 0; i < reducerNameArr.length; i++){
      if (action.type === `${value}/${reducerNameArr[i]}`){
        return reducerObj[reducerNameArr[i]](state, action)
      }
    }
    return state;
  }

  sagaModule[value] = {...sagaModule[value], ...{effect, reducer}};
})
export default sagaModule;
