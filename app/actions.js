import fetch from 'isomorphic-fetch';

// *****
// ** ACTIONS FOR INFORMATION OF ALL ROVERS
//

export const INVALIDATE_ALL_ROVERS = "invalidateAllRovers";

export function invalidateAllRovers(rovers) {
    return {
        type: INVALIDATE_ALL_ROVERS,
        rovers
    }
};

export const REFRESH_ROVERS = "refreshRovers";

function refreshRover(rovers) {
    return {
        type: REFRESH_ROVERS,
        rovers
    }
};

export const REQUEST_ALL_ROVERS_DATA = "requestAllRoversData";

function requestAllRoversData(rovers) {
    return {
        type: REQUEST_ALL_ROVERS_DATA,
        rovers
    }
};

export const RECEIVE_ALL_ROVERS_DATA = "receiveAllRoversData";

function receiveAllRoversData(json) {
    return {
        type: RECEIVE_ALL_ROVERS_DATA,
        simpleDataAboutAllRovers: json.rovers
    }
}

export function fetchAllRoversData() {
    return function (dispatch) {
        // dispatch(requestAllRoversData())
        return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=8m8bkcVYqxE5j0vQL2wk1bpiBGibgaqCrOvwZVyU`).then(response => response.json()).then(json =>
            dispatch(receiveAllRoversData(json))
        )
    }
}

function shouldFetchAllRoverData(state) {
    // const data = state.getDataByRover;
    const data = state.getAllRoversData.AllRovers.simpleDataAboutAllRovers;
    if (!data) {
        return true
    } else if (data.isFetching) {
        return false
    } else {
        return data.didInvalidate
    }
}

export function fetchAllRoverDataIfNeeded() {
    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.

    return (dispatch, getState) => {
        if (shouldFetchAllRoverData(getState())) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchAllRoversData())
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}

// LOOK AT http://redux.js.org/docs/introduction/Examples.html#real-world for ERROR MESSAGE HANDLING

// *****
// ** ACTIONS FOR INDIVIDUAL ROVER
//

export const SELECT_ROVER = "selectRover";

export function selectRover(rover) {
    return {
        type: SELECT_ROVER,
        rover
    }
};

export const INVALIDATE_ROVER = "invalidateRover";

export function invalidateRover(rover) {
    return {
        type: INVALIDATE_ROVER,
        rover
    }
};

export const REFRESH_ROVER = "refreshRover";

function refreshRover(rover) {
    return {
        type: REFRESH_ROVER,
        rover
    }
};

export const REQUEST_ROVERS_DATA = "requestRoversData";

function requestRoversData(rover) {
    return {
        type: REQUEST_ROVERS_DATA,
        rover
    }
}

export const RECEIVE_ROVERS_DATA = "receiveRoversData"

function receiveRoversData(rover, json) {
    return {
        type: RECEIVE_ROVERS_DATA,
        rover,
        name: json.rover.name,
        id: json.rover.id,
        data: json.rover,
        receivedAt: Date.now(),
    }
}

export function fetchRoversData(rover) {
    return function (dispatch) {
        dispatch(requestRoversData(rover))
        return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}?api_key=a4q0jhngYKp9kn0cuwvKMHtKz7IrkKtFBRaiMv5t`).then(response => response.json()).then(json =>
            dispatch(receiveRoversData(rover, json))
        )
    }
}

function shouldFetchRoverData(state, rover) {
    // const data = state.getDataByRover;
    const data = state.getDataByRover[rover];
    if (!data) {
        return true
    } else if (data.isFetching) {
        return false
    } else {
        return data.didInvalidate
    }
}

export function fetchRoverDataIfNeeded(rover) {
    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.
    return (dispatch, getState) => {
        if (shouldFetchRoverData(getState(), rover)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchRoversData(rover))
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}

// *****
// ** ACTIONS FOR ROVER PICTURES
//

export const INVALIDATE_ROVER_IMAGES = "invalidateAllRoverImages";

export function invalidateRoverImages(rover, camera) {
    return {
        type: INVALIDATE_ROVER_IMAGES,
        rover,
        camera,
    }
};

export const REFRESH_ROVER_IMAGES = "refreshRoverImages";

function refreshRoverImages(rover, camera) {
    return {
        type: REFRESH_ROVER_IMAGES,
        rover,
        camera,
    }
};

export const REQUEST_ROVERS_IMAGES = "requestRoversImages";

function requestRoversImages(rover, camera, sol) {
    console.log("request rovers images action");
    return {
        type: REQUEST_ROVERS_IMAGES,
        rover,
        camera,
        sol
    }
}

export const ADD_EMPTY_SOL = "addEmptySol";

function addEmptySol(rover, camera, sol){
    return{
        type: ADD_EMPTY_SOL,
        rover,
        camera,
        sol,
    }
}

export const RECEIVE_ROVER_IMAGES = "receiveRoverImages";

function receiveRoverImages(rover, json) {
    // For earthDate, camera, cameraFullName, and sol we just need to get the data from the first returned object
    // because this data will stay the same for each photo object from a Request
    return {
        type: RECEIVE_ROVER_IMAGES,
        rover,
        name: rover,
        earthDate: json.photos[0].earth_date,
        camera: json.photos[0].camera.name,
        cameraFullName: json.photos[0].camera.full_name,
        photos: json.photos,
        sol: json.photos[0].sol
    }
}

export function fetchRoverImages(rover, sol, page, camera, cameraIndex) {
    return function (dispatch) {
        dispatch(requestRoversImages(rover, camera, sol))
        return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/` + rover + `/photos?sol=` + sol + `&camera=` + camera + `&page=` + page + `&api_key=a4q0jhngYKp9kn0cuwvKMHtKz7IrkKtFBRaiMv5t`).then(response => response.json()).then(json => {
            if (json.photos.length > 0) {
                console.log("there are images!");
                dispatch(cameraSelected(rover, cameraIndex, camera, json.photos[0].camera.full_name, sol));
                return dispatch(receiveRoverImages(rover, json));
            } else {
                console.log("there arent images lets try again!");
                dispatch(addEmptySol(rover, camera, sol));
                return dispatch(fetchRoverImages(rover, sol - 1, page, camera, cameraIndex));
            }
        })
    }
}

function shouldFetchRoverImages(state, rover, camera) {
    const data = state.getDataByRover[rover][camera];
    if (!data) {
        return true
    } else if (data.isFetching) {
        return false
    } else {
        return data.didInvalidate
    }
}

export function fetchRoverImagesIfNeeded(rover, sol, page, camera, cameraIndex) {
    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.
    return (dispatch, getState) => {
        if (shouldFetchRoverImages(getState(), rover, camera)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchRoverImages(rover, sol, page, camera, cameraIndex))
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}

// LOOK AT http://redux.js.org/docs/introduction/Examples.html#real-world for ERROR MESSAGE HANDLING

// *****
// ** ACTIONS FOR APP
//

export const CAMERA_SELECTED = "cameraSelected";

export function cameraSelected(rover, cameraIndex, camera, cameraFullName, sol) {
    return {
        type: CAMERA_SELECTED,
        rover,
        cameraIndex,
        camera,
        cameraFullName,
        sol,
    }
}

export const CAMERA_UNSELECTED = "cameraUnselected";

export function cameraUnselected() {
    return {
        type: CAMERA_UNSELECTED
    }
}