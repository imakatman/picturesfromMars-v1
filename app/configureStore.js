import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
// import {selectRover, fetchRoversData} from './actions'
import rootReducer from './reducers'
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

// store.dispatch(selectRover('Curiostiy'));
// store.dispatch(fetchRoversData('Curiosity')).then(() =>
//     console.log(store.getState())
// )
// store.dispatch(fetchRoversData('Curiosity'))