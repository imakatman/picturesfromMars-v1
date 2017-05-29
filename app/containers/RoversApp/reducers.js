/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
// import { fromJS } from 'immutable';
// import { LOCATION_CHANGE } from 'react-router-redux';
import {SELECT_ROVER, INVALIDATE_ROVER, REFRESH_ROVER, REQUEST_ROVERS_DATA, RECEIVE_ROVERS_DATA} from './actions.js';
import {INVALIDATE_ALL_ROVERS, RECEIVE_ALL_ROVERS_DATA} from './actions.js';

// import languageProviderReducer from 'containers/LanguageProvider/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
// const routeInitialState = fromJS({
//   locationBeforeTransitions: null,
// });

/**
 * Merge route into the global application state
 */
// function routeReducer(state = routeInitialState, action) {
//   switch (action.type) {
//     /* istanbul ignore next */
//     case LOCATION_CHANGE:
//       return state.merge({
//         locationBeforeTransitions: action.payload,
//       });
//     default:
//       return state;
//   }
// }

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
// export default function createReducer(asyncReducers) {
//   return combineReducers({
//     route: routeReducer,
//     // language: languageProviderReducer,
//     ...asyncReducers,
//   });
// }

// *** Rover reducers
function selectedRover(state = "Curiosity", action){
  switch(action.type){
      case SELECT_ROVER:
        return action.rover
      default:
        return state
  }
}

function roversData(state={
    isFetching: false,
    didInvalidate: false,
    name: "",
    data: {},
    status: "",
  }, action){
  switch(action.type){
      case INVALIDATE_ROVER:
        return Object.assign({}, state, {
          didInvalidate: true,
        })
      case REQUEST_ROVERS_DATA:
        return Object.assign({}, state, {
            isFetching: true,
            didInvalidate: false,
        })
      case RECEIVE_ROVERS_DATA:
          return Object.assign({}, state, {
              isFetching: false,
              didInvalidate: false,
              name: action.name,
              data: action.data,
              lastUpdated: action.receivedAt
          })
      default:
        return state
  }
}

function getDataByRover(state={ }, action){
  switch(action.type){
      case INVALIDATE_ROVER:
      case REQUEST_ROVERS_DATA:
      case RECEIVE_ROVERS_DATA:
        return Object.assign({}, state, {
          Rover: roversData(state[action.rover], action)
        })
      default:
        return state
  }
}

function allRoversData(state={ }, action){
    switch(action.type){
        case INVALIDATE_ALL_ROVERS:
            return Object.assign({}, state, {
                didInvalidate: true,
            })
        case RECEIVE_ALL_ROVERS_DATA:
            return Object.assign({}, state, {
                isFetchingAll: false,
                didInvalidateAll: false,
                simpleDataAboutAllRovers: action.simpleDataAboutAllRovers,
                lastUpdatedAll: Date.now()
            })
        default:
            return state
    }
}

function getAllRoversData(state={AllRovers: {}}, action){
    switch(action.type){
        case INVALIDATE_ALL_ROVERS:
        case RECEIVE_ALL_ROVERS_DATA:
            return Object.assign({}, state, {
                AllRovers: allRoversData(state[action.rovers], action)
            })
        default:
            return state
    }
}

const rootReducer = combineReducers({
    getDataByRover,
    selectedRover,
    getAllRoversData
});

export default rootReducer;


