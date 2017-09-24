import { routerReducer, routerMiddleware } from 'react-router-redux';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { autoRehydrate } from 'redux-persist';

import { getAllRoversData } from './containers/HomePage/reducers';
import { selectedRover, getDataByRover, selectedImage } from './containers/SelectedRoverPage/reducers';
import { selectedCamera, apiKeys } from './reducers';
import { emptySols } from './emptySols';

const rootReducer = combineReducers({
  getAllRoversData,
  selectedRover,
  getDataByRover,
  selectedImage,
  selectedCamera,
  apiKeys,
  routing: routerReducer,
});

const loggerMiddleware = createLogger();

export default function configureStore() {
  return createStore(
    rootReducer,
    emptySols,
    compose(
      autoRehydrate(),
      applyMiddleware(
        thunkMiddleware,
        routerMiddleware(history),
        loggerMiddleware
      )
    )
  );
}
