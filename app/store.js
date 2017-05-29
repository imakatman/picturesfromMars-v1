import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import rootReducer from 'containers/RoversApp/reducers'

const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    )
}

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
