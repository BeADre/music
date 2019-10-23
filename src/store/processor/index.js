import {takeEvery} from "redux-saga/effects";

const modulesFiles = require.context("../module/", false, /\.js$/); // 读取所有模块
console.log(modulesFiles)
debugger
// keys {Function} -返回匹配成功模块的名字组成的数组
const storeModule = modulesFiles.keys().reduce((accumulator, filename) => {
  const moduleName = filename.replace(/^\.\/(.*)\.\w+$/, '$1');
  const sagaAction = modulesFiles(filename); // 返回对应模块对象
  accumulator[moduleName] = sagaAction.default; // 模块对象默认导出的对象，格式为key(filename)/value(默认导出的Object)形式
  return accumulator;
}, {});

Object.keys(storeModule).forEach(value => {
  const initState = storeModule[value].state; // 模块对应的初始state

  // 将每个effect对象中的函数转化为redux-saga中监听action的函数
  const effect = Object.keys(storeModule[value].effect).reduce((effectArr, funcName) => {
      return [...effectArr, ...[takeEvery(`${value}/${funcName}`, storeModule[value].effect[funcName])]]
  }, []);

  const reducer = {};
  const reducerObj = storeModule[value].reducer
  const reducerNameArr = Object.keys(reducerObj);
  // 将所有reducer函数转化为一个大的reducer函数
  reducer[value] = function (state = initState, action) {
    for (let i = 0; i < reducerNameArr.length; i++){
      if (action.type === `${value}/${reducerNameArr[i]}`){
        return reducerObj[reducerNameArr[i]](state, action)
      }
    }
    return state;
  }

  storeModule[value] = {...storeModule[value], ...{effect, reducer}};
})
export default storeModule;
