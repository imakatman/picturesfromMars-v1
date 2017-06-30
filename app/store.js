import { createStore, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
// import { syncHistoryWithStore } from 'react-router-redux'
import {createLogger} from 'redux-logger'
import {autoRehydrate} from 'redux-persist'
import rootReducer from 'reducers'


const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(
        rootReducer,
        compose(
            applyMiddleware(
                thunkMiddleware,
                routerMiddleware(history),
                loggerMiddleware
            ),
            autoRehydrate()
        )
    )
}
