import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import {createLogger} from 'redux-logger'
import rootReducer from 'reducers'


const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(
            thunkMiddleware,
            routerMiddleware(history),
            loggerMiddleware
        )
    )
}
