import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import {createLogger} from 'redux-logger'
import rootReducer from 'containers/RoversApp/reducers'

const loggerMiddleware = createLogger()

export default function configureStore(history) {
    return createStore(
        rootReducer,
        applyMiddleware(
            thunkMiddleware,
            routerMiddleware(history),
            loggerMiddleware
        )
    )
}
