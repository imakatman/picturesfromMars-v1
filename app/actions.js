import fetch from 'isomorphic-fetch';

// *****
// ** INDIVIDUAL ROVER ACTIONS
//

export const SELECT_ROVER = "selectRover";

export function selectRover(rover){
    return{
        type: SELECT_ROVER,
        rover
    }
};

export const INVALIDATE_ROVER = "invalidateRover";

export function invalidateRover(rover){
    return{
        type: INVALIDATE_ROVER,
        rover
    }
};

export const REFRESH_ROVER = "refreshRover";

function refreshRover(rover){
    return{
        type: REFRESH_ROVER,
        rover
    }
};

export const REQUEST_ROVERS_DATA = "requestRoversData";

function requestRoversData(rover){
    return{
        type: REQUEST_ROVERS_DATA,
        rover
    }
}

export const RECEIVE_ROVERS_DATA = "receiveRoversData"

function receiveRoversData(rover, json){
    return{
        type: RECEIVE_ROVERS_DATA,
        rover,
        name: json.rover.name,
        id: json.rover.id,
        data: json.rover,
        receivedAt: Date.now(),
    }
}

export function fetchRoversData(rover){
    return function(dispatch){
        dispatch(requestRoversData(rover))
        return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}?api_key=a4q0jhngYKp9kn0cuwvKMHtKz7IrkKtFBRaiMv5t`)
            .then(response => response.json())
            .then(json=>
                dispatch(receiveRoversData(rover, json))
            )
    }
}

function shouldFetchRoverData(state, rover) {
    // const data = state.getDataByRover;
    const data = state.getDataByRover[rover]
    console.log("hello");
    if (!data) {
        console.log("this rovers data is not here");
        return true
    } else if (data.isFetching) {
        console.log("rover data is fetching!");
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
            console.log("rover data is here no need to fetch!");
            return Promise.resolve()
        }
    }
}



// *****
// ** ACTIONS FOR INFORMATION OF ALL ROVERS
//

export const INVALIDATE_ALL_ROVERS = "invalidateAllRovers";

export function invalidateAllRovers(rovers){
    return{
        type: INVALIDATE_ALL_ROVERS,
        rovers
    }
};

export const REFRESH_ROVERS = "refreshRovers";

function refreshRover(rovers){
    return{
        type: REFRESH_ROVERS,
        rovers
    }
};

// export const REQUEST_ALL_ROVERS_DATA = "requestAllRoversData";
//
// function requestAllRoversData(){
//     return{
//         type: REQUEST_ALL_ROVERS_DATA,
//     }
// }

export const RECEIVE_ALL_ROVERS_DATA = "receiveAllRoversData";

function receiveAllRoversData(json){
    return{
        type: RECEIVE_ALL_ROVERS_DATA,
        simpleDataAboutAllRovers: json.rovers
    }
}

export function fetchAllRoversData(){
    return function(dispatch){
        // dispatch(requestAllRoversData())
        return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=8m8bkcVYqxE5j0vQL2wk1bpiBGibgaqCrOvwZVyU`)
        .then(response => response.json())
        .then(json=>
            dispatch(receiveAllRoversData(json))
        )
    }
}

function shouldFetchAllRoverData(state) {
    // const data = state.getDataByRover;
    const data = state.getAllRoversData.AllRovers.simpleDataAboutAllRovers;
    console.log(state.getAllRoversData.AllRovers);
    if (!data) {
        console.log("there is no data");
        return true
    } else if (data.isFetching) {
        console.log("rover is still fetching");
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
            console.log("no need to fetch data is there!")
            return Promise.resolve()
        }
    }
}

// LOOK AT http://redux.js.org/docs/introduction/Examples.html#real-world for ERROR MESSAGE HANDLING


// *****
// ** ACTIONS FOR ROVERS PICTURES
//

// export const INVALIDATE_ROVERS_IMAGES = "invalidateAllRoversImages";
//
// export function invalidateRoversImages(rovers){
//     return{
//         type: INVALIDATE_ROVERS_IMAGES,
//         rovers
//     }
// };
//
// export const REFRESH_ROVERS_IMAGES = "refreshRoversImages";
//
// function refreshRover(rovers){
//     return{
//         type: REFRESH_ROVERS_IMAGES,
//         rovers
//     }
// };
//
// // export const REQUEST_ALL_ROVERS_DATA = "requestAllRoversData";
// //
// // function requestAllRoversData(){
// //     return{
// //         type: REQUEST_ALL_ROVERS_DATA,
// //     }
// // }
//
// export const RECEIVE_ROVERS_IMAGES = "receiveRoversImages"
//
// function receiveAllRoversData(rovers, json){
//     return{
//         type: RECEIVE_ROVERS_IMAGES,
//         simpleDataAboutAllRovers: json.rovers
//     }
// }

// export function fetchAllRoversData(rovers){
//     return function(dispatch){
//         // dispatch(requestAllRoversData())
//         return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=8m8bkcVYqxE5j0vQL2wk1bpiBGibgaqCrOvwZVyU`)
//         .then(response => response.json())
//         .then(json=>
//             dispatch(receiveAllRoversData(rovers, json))
//         )
//     }
// }
//
// function shouldFetchAllRoverData(state, rovers) {
//     // const data = state.getDataByRover;
//     const data = state.getAllRoversData[rovers]
//     if (!data) {
//         return true
//     } else if (roverData.isFetching) {
//         return false
//     } else {
//         return data.didInvalidate
//     }
// }
//
// export function fetchAllRoverDataIfNeeded(rovers) {
//     // Note that the function also receives getState()
//     // which lets you choose what to dispatch next.
//
//     // This is useful for avoiding a network request if
//     // a cached value is already available.
//
//     return (dispatch, getState) => {
//         if (shouldFetchAllRoverData(getState(), rovers)) {
//             // Dispatch a thunk from thunk!
//             return dispatch(fetchAllRoversData(rovers))
//         } else {
//             // Let the calling code know there's nothing to wait for.
//             return Promise.resolve()
//         }
//     }
// }

// LOOK AT http://redux.js.org/docs/introduction/Examples.html#real-world for ERROR MESSAGE HANDLING