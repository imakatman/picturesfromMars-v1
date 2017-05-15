import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { selectRover, fetchRoversData } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    )
};

// const store = createStore(
//     rootReducer,
//     // preloadedState,
//     applyMiddleware(
//         thunkMiddleware,
//         loggerMiddleware
//     )
// )
//
// export default store;

// store.dispatch(selectRover('Curiostiy'));
// store.dispatch(fetchRoversData('Curiosity')).then(() =>
//     console.log(store.getState())
// )
