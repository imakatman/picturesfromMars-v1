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
        return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}?api_key=8m8bkcVYqxE5j0vQL2wk1bpiBGibgaqCrOvwZVyU`)
        .then(response => response.json()).then(json =>
            dispatch(receiveRoversData(rover, json))
        )
    }
}

function shouldFetchRoverData(state, rover) {
    // const data = state.getDataByRover;
    const data = state.getDataByRover[rover];
    // if (Object.keys(data["data"]).length === 0) {
    if (typeof data === 'undefined') {
        console.log("no data");
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
    // a cached value is already available.console.log("fetth rover data");
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

export const ADD_EMPTY_SOL = "addEmptySol";

function addEmptySol(rover, camera, sol) {
    return {
        type: ADD_EMPTY_SOL,
        rover,
        camera,
        sol,
    }
}

export const ADD_MEANINGFUL_SOL = "addMeaningfulSol";

function addMeaningfulSol(rover, camera, sol) {
    return {
        type: ADD_MEANINGFUL_SOL,
        rover,
        camera,
        sol,
    }
}

export const DISPLAY_NOT_FOUND = "displayNotFound";

function displayNotFound(rover){
    return {
        type: DISPLAY_NOT_FOUND,
        rover
    }
}

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
        sol: json.photos[0].sol,
    }
}

function findSolNotInEmptySols(state, rover, camera, sol){
    if(state.getDataByRover[rover][camera]["emptySols"].includes(sol)){
        console.log("the provided sol + 1 is in the empty sols array");
        return findSolNotInEmptySols(state, sol + 1);
    } else {
        console.log("the provided sol is not in the empty sols array");
        return function(dispatch){
            dispatch(requestRoversImages(rover, camera, sol));
        }
    }
}

export function fetchRoverImages(rover, sol, page, camera, cameraFullName, cameraIndex) {
    return function (dispatch, getState) {
        // console.log(getState.getDataByRover[rover][camera]["emptySols"]);
        console.log(getState());
        if(typeof getState().getDataByRover[rover][camera] !== 'undefined' && getState().getDataByRover[rover][camera]["emptySols"].includes(sol)){
            console.log("there is an empty sols array for this camera and the provided sol is in it");
            findSolNotInEmptySols(getState(), rover, camera, sol + 1);
        } else {
            console.log("there isnt an empty sols array for this camera");
            dispatch(requestRoversImages(rover, camera, sol));
        }
        return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/` + rover + `/photos?sol=` + sol + `&camera=` + camera + `&page=` + page + `&api_key=8m8bkcVYqxE5j0vQL2wk1bpiBGibgaqCrOvwZVyU`).then(response => response.json()).then(json => {
            if (json.photos.length > 0) {
                const earthDate = json.photos[0].earth_date;
                console.log(cameraIndex + " " +  cameraFullName);
                dispatch(selectedCamera(rover, cameraIndex, camera, cameraFullName, sol, earthDate));
                dispatch(addMeaningfulSol(rover, camera, sol));
                return dispatch(receiveRoverImages(rover, json));
            } else {
                console.log("there arent images lets try again!");
                dispatch(addEmptySol(rover, camera, sol));
                return dispatch(fetchRoverImages(rover, sol - 1, page, camera, cameraIndex));
            }
        })
    }
}

function shouldFetchRoverImages(state, rover, camera, sol) {
    if (typeof state.getDataByRover[rover][camera] == null || typeof state.getDataByRover[rover][camera] == 'undefined') {
        console.log("no camera data");
        return true
    } else if (typeof state.getDataByRover[rover][camera][sol] == 'undefined') {
        console.log("no specific sol data");
        return true
    } else {
        return false
    }
}

export function fetchRoverImagesIfNeeded(rover, sol, page, camera, cameraFullName, cameraIndex) {
    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.
    console.log("hi");
    return (dispatch, getState) => {
        if (shouldFetchRoverImages(getState(), rover, camera, sol)) {
            // Dispatch a thunk from thunk!
            console.log("should fetch rover images");
            return dispatch(fetchRoverImages(rover, sol, page, camera, cameraFullName, cameraIndex))
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}

export function fetchRoverImagesOnce(rover, sol, page, camera, cameraFullName, cameraIndex) {
    return function (dispatch) {
        dispatch(requestRoversImages(rover, camera, sol));
        return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/` + rover + `/photos?sol=` + sol + `&camera=` + camera + `&page=` + page + `&api_key=8m8bkcVYqxE5j0vQL2wk1bpiBGibgaqCrOvwZVyU`).then(response => response.json()).then(json => {
            if (json.photos.length > 0) {
                const earthDate = json.photos[0].earth_date;
                console.log("there are images!");
                dispatch(selectedCamera(rover, cameraIndex, camera, cameraFullName, sol, earthDate));
                dispatch(addMeaningfulSol(rover, camera, sol));
                return dispatch(receiveRoverImages(rover, json));
            } else {
                console.log("there arent images in this sol!");
                dispatch(displayNotFound(rover));
                return dispatch(selectedCamera(...[rover, cameraIndex, camera, cameraFullName, sol, ]));
            }
        })
    }
}

export function fetchRoverImagesIfNeededOnce(rover, sol, page, camera, cameraFullName, cameraIndex) {
    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.
    console.log("fetching rover images if needed");
    return (dispatch, getState) => {
        if (shouldFetchRoverImages(getState(), rover, camera, sol)) {
            // Dispatch a thunk from thunk!
            console.log("should fetch rover images");
            return dispatch(fetchRoverImagesOnce(rover, sol, page, camera, cameraFullName, cameraIndex))
        } else {
            // Let the calling code know there's nothing to wait for.
            dispatch(displayNotFound(rover));
            dispatch(selectedCamera(...[rover, cameraIndex, camera, cameraFullName, sol, ]));
            return Promise.resolve()
        }
    }
}
export function fetchNextRoverImages(rover, sol, page, camera, cameraFullName, cameraIndex) {
    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.
    return (dispatch) => {
        return dispatch(fetchRoverImages(rover, sol, page, camera, cameraFullName, cameraIndex));
    }
}

// LOOK AT http://redux.js.org/docs/introduction/Examples.html#real-world for ERROR MESSAGE HANDLING

// *****
// ** ACTIONS FOR APP
//

export const SELECTED_CAMERA = "selectedCamera";

export function selectedCamera(rover, cameraIndex, camera, cameraFullName, sol, earthDate) {
    return {
        type: SELECTED_CAMERA,
        rover,
        cameraIndex,
        camera,
        cameraFullName,
        sol,
        earthDate
    }
}

export const UNSELECTED_CAMERA = "unselectedCamera";

export function unselectedCamera() {
    return {
        type: UNSELECTED_CAMERA
    }
}