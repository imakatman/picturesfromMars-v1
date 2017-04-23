import fetch from 'isomorphic-fetch';

export const SELECT_ROVER = "selectRover";

export function selectRover(rover){
    return{
        type: SELECT_ROVER,
        rover
    }
};

export const INVALIDATE_ROVER = "invalidateRover";

function invalidateRover(rover){
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

function receiveRoversData(rover){
    return{
        type: RECEIVE_ROVERS_DATA,
        rover,
        data: json.data.children.map(child => child.data),
        recievedAt: Date.now()
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
    const data = state.getDataByRover[rover]
    if (!data) {
        return true
    } else if (posts.isFetching) {
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

// LOOK AT http://redux.js.org/docs/introduction/Examples.html#real-world for ERROR MESSAGE HANDLING