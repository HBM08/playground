import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reduxReset from 'redux-reset'
import * as reducers from './reducers';

const combinedReducers = combineReducers(reducers);

const middlewares = [thunk, createLogger()];

export default function configureStore(initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    combinedReducers,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares), reduxReset())
  );
}
