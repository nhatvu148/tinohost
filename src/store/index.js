import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { createInjectorsEnhancer } from 'redux-injectors';

import createReducer from './rootReducer';
import rootSaga from './rootSaga';

const createStore = () => {
  const saga = createSagaMiddleware();
  let devTools = null;
  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});

    // NOTE: Uncomment the code below to restore support for Redux Saga
    // Dev Tools once it supports redux-saga version 1.x.x
    // if (window.__SAGA_MONITOR_EXTENSION__)
    //   reduxSagaMonitorOptions = {
    //     sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
    //   };
    /* eslint-enable */
  }

  const injectorEnhancer = createInjectorsEnhancer({
    createReducer,
    runSaga: saga.run,
  });

  const store = configureStore({
    reducer: createReducer(),
    devTools,
    middleware: [saga],
    enhancers: [injectorEnhancer],
  });
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry
  saga.run(rootSaga);

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  return store;
};

export default createStore;
