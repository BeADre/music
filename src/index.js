import React from 'react';
import ReactDOM from 'react-dom';
import Main from "./pages"
import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {Provider} from "react-redux"
import reducer from './store/processor/reducer'
import rootSaga from './store/processor/sagas'
import {BrowserRouter} from "react-router-dom";
import * as serviceWorker from './serviceWorker';


const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(rootSaga)


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Main/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);


serviceWorker.unregister();
