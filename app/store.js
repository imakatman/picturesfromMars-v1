import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import { autoRehydrate } from 'redux-persist';
import { getAllRoversData } from './containers/HomePage/reducers';
import { selectedRover, getDataByRover, selectedCamera } from './containers/SelectedRoverPage/reducers';


const rootReducer = combineReducers({
    getAllRoversData,
    selectedRover,
    getDataByRover,
    selectedCamera,
    routing: routerReducer,
});

const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(
        rootReducer,
        compose(
            autoRehydrate(),
            applyMiddleware(
                thunkMiddleware,
                routerMiddleware(history),
                loggerMiddleware
            )
        )
    )
}
