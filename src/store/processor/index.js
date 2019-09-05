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

  const reducer = Object.keys(sagaModule[value].reducer).reduce((reducerObj, funcName) => {
    const preReducer = sagaModule[value].reducer[funcName];
    reducerObj[funcName] = (state = initState, action) => {
      if (action.type === `${value}/${funcName}`) return preReducer(state, action);
      else return state
    }
    return reducerObj;
  }, {});

  sagaModule[value] = {...sagaModule[value], ...{effect, reducer}};
})
export default sagaModule;
