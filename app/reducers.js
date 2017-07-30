/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import {SELECT_ROVER, INVALIDATE_ROVER, REFRESH_ROVER, REQUEST_ROVERS_DATA, RECEIVE_ROVERS_DATA} from './actions.js';
import {INVALIDATE_ALL_ROVERS, RECEIVE_ALL_ROVERS_DATA, REQUEST_ALL_ROVERS_DATA} from './actions.js';
import {INVALIDATE_ROVER_IMAGES, RECEIVE_ROVER_IMAGES, REQUEST_ROVERS_IMAGES} from './actions.js';
import {CAMERA_SELECTED, CAMERA_UNSELECTED} from './actions';
import {ADD_EMPTY_SOL, ADD_MEANINGFUL_SOL} from './actions';

// *** Rover reducers
function selectedRover(state = "", action) {
    switch (action.type) {
        case SELECT_ROVER:
            return action.rover
        default:
            return state
    }
}

// function addEmptySol(state = {emptySols: []}, action) {
//     console.log(state);
//     switch (action.type) {
//         case ADD_EMPTY_SOL:
//             return Object.assign({}, state, {
//                 emptySols: action.sol
//             });
//         default:
//             return state
//     }
// }
//
// function addMeaningfulSol(state = {
//     latestMeaningfulSol: "",
//     meaningfulSols: []
// }, action) {
//     console.log(state);
//     switch (action.type) {
//         case ADD_MEANINGFUL_SOL:
//             return Object.assign({}, state, {
//                 latestMeaningfulSol: action.sol,
//                 meaningfulSolsArrays: action.sol
//             });
//         default:
//             return state
//     }
// }

function addSolImageData(state, action){
    console.log(state);
    switch (action.type) {
        case ADD_MEANINGFUL_SOL:
            return Object.assign({}, state, {
                latestMeaningfulSol: action.sol,
                meaningfulSols: state.meaningfulSols.push(action.sol)
            });
        case ADD_EMPTY_SOL:
            return Object.assign({}, state, {
                emptySols: state.emptySols.push(action.sol)
            });
        default:
            return state
    }
}

function receiveRoversImages(state = {
    didInvalidate: false,
    isFetching: false,
    hasFetchedImages: false,
    sol: "",
    earthDate: "",
    camera: "",
    cameraFullName: "",
    photoData: [],
}, action) {
    switch (action.type) {
        case INVALIDATE_ROVER_IMAGES:
            return Object.assign({}, state, {
                didInvalidate: true,
            })
        case REQUEST_ROVERS_IMAGES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
                sol: action.sol,
            })
        case RECEIVE_ROVER_IMAGES:
            return Object.assign({}, state, {
                hasFetchedImages: true,
                isFetching: false,
                didInvalidate: false,
                sol: action.sol,
                earthDate: action.earthDate,
                camera: action.camera,
                cameraFullName: action.cameraFullName,
                photoData: action.photos,
            })
        default:
            return state
    }
}

function putRoverImageDataIntoSolObjects(state = {
    latestMeaningfulSol: "",
    meaningfulSols: [],
    emptySols: []
}, action) {
    switch (action.type) {
        case INVALIDATE_ROVER_IMAGES:
            return Object.assign({}, state, {
                [action.sol]: receiveRoversImages(state[action.sol], action)
            })
        case REQUEST_ROVERS_IMAGES:
            return Object.assign({}, state, {
                [action.sol]: receiveRoversImages(state[action.sol], action)
            })
        case RECEIVE_ROVER_IMAGES:
            return Object.assign({}, state, {
                hasFetchedImages: true,
                [action.sol]: receiveRoversImages(state[action.sol], action)
            })
        default:
            return state
    }
}

function roversImages(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_ROVER_IMAGES:
            return Object.assign({}, state, {
                [action.camera]: putRoverImageDataIntoSolObjects(state[action.camera], action)
            })
        case REQUEST_ROVERS_IMAGES:
            return Object.assign({}, state, {
                [action.camera]: putRoverImageDataIntoSolObjects(state[action.camera], action)
            })
        case ADD_EMPTY_SOL:
            return Object.assign({}, state, {
                [action.camera]: addSolImageData(state[action.camera], action)
            })
        case ADD_MEANINGFUL_SOL:
            return Object.assign({}, state, {
                [action.camera]: addSolImageData(state[action.camera], action)
            })
        case RECEIVE_ROVER_IMAGES:
            return Object.assign({}, state, {
                [action.camera]: putRoverImageDataIntoSolObjects(state[action.camera], action)
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
                didInvalidate: true,
            })
        case REQUEST_ROVERS_DATA:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE_ROVERS_DATA:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                name: action.name,
                data: action.data,
                lastUpdated: action.receivedAt,
                hasFetchedImages: false,
            })
        default:
            return state
    }
}

function getDataByRover(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_ROVER:
        case RECEIVE_ROVERS_DATA:
        case REQUEST_ROVERS_DATA:
            return Object.assign({}, state, {
                [action.rover]: roversData(state[action.rover], action)
            })
        case INVALIDATE_ROVER_IMAGES:
        case RECEIVE_ROVER_IMAGES:
        case ADD_EMPTY_SOL:
            return Object.assign({}, state, {
                [action.rover]: roversImages(state[action.rover], action)
            })
        case ADD_MEANINGFUL_SOL:
            return Object.assign({}, state, {
                [action.rover]: roversImages(state[action.rover], action)
            })
        case REQUEST_ROVERS_IMAGES:
            return Object.assign({}, state, {
                [action.rover]: roversImages(state[action.rover], action)
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

function selectCamera(state = {}, action) {
    switch (action.type) {
        case CAMERA_SELECTED:
            return Object.assign({}, state, {
                selected: true,
                rover: action.rover,
                cameraIndex: action.cameraIndex,
                camera: action.camera,
                cameraFullName: action.cameraFullName,
                sol: action.sol,
            });
        case CAMERA_UNSELECTED:
            return Object.assign({}, state, {
                selected: false,
                rover: undefined,
                cameraIndex: undefined,
                camera: undefined,
                cameraFullName: undefined,
                sol: undefined,
            })
        default:
            return state
    }
}

const rootReducer = combineReducers({
    getDataByRover,
    selectedRover,
    getAllRoversData,
    selectCamera,
    routing: routerReducer,
});

export default rootReducer;



