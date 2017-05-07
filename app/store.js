import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import {selectRover, fetchRoversData} from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)

// store.dispatch(selectRover('Curiostiy'));
// store.dispatch(fetchRoversData('Curiosity')).then(() =>
//     console.log(store.getState())
// )
store.dispatch(fetchRoversData('Curiosity'))

export default store;