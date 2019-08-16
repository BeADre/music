import React from 'react';
import ReactDOM from 'react-dom';
import Main from "./pages"
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from "react-redux"
import reducer from './store/reducers'
import { testSaga } from './store/sagas'
import * as serviceWorker from './serviceWorker';


const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(testSaga)


ReactDOM.render(
  <Provider store={store}>
    <Main/>
  </Provider>,
  document.getElementById('root')
);


serviceWorker.unregister();
