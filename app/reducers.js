/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import {SELECT_ROVER, INVALIDATE_ROVER, REFRESH_ROVER, REQUEST_ROVERS_DATA, RECEIVE_ROVERS_DATA} from './actions.js';
import {INVALIDATE_ALL_ROVERS, RECEIVE_ALL_ROVERS_DATA} from './actions.js';
import {INVALIDATE_ROVER_IMAGES, RECEIVE_ROVER_IMAGES} from './actions.js';

// *** Rover reducers
function selectedRover(state = "", action) {
    switch (action.type) {
        case SELECT_ROVER:
            return action.rover
        default:
            return state
    }
}

function roversImages(state = {
    isFetching: false,
    didInvalidate: false,
    sol: "",
    earthDate: "",
    camera: "",
    cameraFullName: "",
    photoData: {},
    status: "",
}, action) {
    const camera = action.camera;
    switch (action.type) {
        case INVALIDATE_ROVER_IMAGES:
            return Object.assign({}, state, {
                [camera]: {
                    didInvalidate: true,
                }
            })
        case RECEIVE_ROVER_IMAGES:
            return Object.assign({}, state, {
                [camera]: {
                    isFetching: false,
                    didInvalidate: false,
                    sol: action.sol,
                    earthDate: action.earthDate,
                    camera: action.camera,
                    cameraFullName: action.cameraFullName,
                    photoData: action.photos,
                    lastUpdated: action.receivedAt
                }
            })
        default:
            return state
    }
}

function roversData(state = {
    isFetching: false,
    didInvalidate: false,
    name: "",
    data: {},
    status: ""
}, action) {
    switch (action.type) {
        case INVALIDATE_ROVER:
            return Object.assign({}, state, {
                [rover]: {
                    didInvalidate: true,
                }
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

function getDataByRover(state = {}, action) {
    const rover = action.name;
    switch (action.type) {
        case INVALIDATE_ROVER:
        case RECEIVE_ROVERS_DATA:
            return Object.assign({}, state, {
                [rover]: roversData(state[action.rover], action)
            })
        case RECEIVE_ROVER_IMAGES:
            return Object.assign({}, state, {
                [rover]: roversImages(state[action.rover], action)
            })
        default:
            return state
    }
}

function allRoversData(state = {}, action) {
    switch (action.type) {
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

function getAllRoversData(state = {AllRovers: {}}, action) {
    switch (action.type) {
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
    getAllRoversData,
    routing: routerReducer,
});

export default rootReducer;



