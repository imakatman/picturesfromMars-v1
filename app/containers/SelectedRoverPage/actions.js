import fetch from 'isomorphic-fetch';

import { selectedACamera, unselectedCamera, handleErrors } from '../../actions';


// ************************************************************
// ******
//
//  Actions specific to fetching a Rover's Mission Manifest Data
//
// ******
// ***********************
// ************************************************************

export const SELECT_ROVER = 'selectRover';

export function selectRover(rover) {
  return {
    type: SELECT_ROVER,
    rover,
  };
}

export const INVALIDATE_ROVER = 'invalidateRover';

export function invalidateRover(rover) {
  return {
    type: INVALIDATE_ROVER,
    rover,
  };
}

export const REQUEST_ROVERS_DATA = 'requestRoversData';

function requestRoversData(rover) {
  return {
    type: REQUEST_ROVERS_DATA,
    rover,
  };
}

export const RECEIVE_ROVERS_DATA = 'receiveRoversData';

function receiveRoversData(rover, json) {
  const dateReceivedOn = new Date();
  return {
    type: RECEIVE_ROVERS_DATA,
    rover,
    name: json.rover.name,
    id: json.rover.id,
    data: json.rover,
    dateDataReceived: dateReceivedOn,
  };
}

export function fetchRoversData(rover) {
  return function (dispatch, getState) {
    dispatch(requestRoversData(rover));
    const apiKeyIndex = getState().apiKeys['index'];
    const apiKey = getState().apiKeys.keys[apiKeyIndex];
    return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}?api_key=${apiKey}`).then(response => handleErrors(response, fetchRoversData, rover)).then(response => response.json()).then(json => dispatch(receiveRoversData(rover, json)));
  };
}

function shouldFetchRoverData(state, rover) {
  if (typeof state.getDataByRover[rover] === 'undefined' || typeof state.getDataByRover[rover]['name'] === 'undefined') {
    return true;
  } else{
    const data = state.getDataByRover[rover]['data'];
    // Check if today is at least 24 hours greater than
    // the dateDataReceived time inside of rover Object
    let today;
    let dayAfterReceivedAt;
    if (typeof data !== 'undefined') {
      today              = Date.now();
      const dateReceived = new Date(data.dateDataReceived);
      const time         = dateReceived.getTime();
      dayAfterReceivedAt = new Date(time + 24 * 60 * 60 * 1000);
      dayAfterReceivedAt = Date.parse(dayAfterReceivedAt);
    }
    // ** End
    if (today >= dayAfterReceivedAt) {
      return true;
    } else if (data.isFetching) {
      return false;
    } else {
      return data.didInvalidate;
    }
  }
}

export function fetchRoverDataIfNeeded(rover) {
  // This is useful for avoiding a network request if
  // a cached value is already available
  return (dispatch, getState) => {
    if (shouldFetchRoverData(getState(), rover)) {
      // Dispatch a thunk from thunk!
      dispatch(unselectedCamera());
      return dispatch(fetchRoversData(rover));
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve();
    }
  };
}

// ************************************************************
// ******
//
//  Actions specific to fetching photos
//
// ******
// ***********************
// ************************************************************

export const ADD_EMPTY_SOL = 'addEmptySol';

function addEmptySol(rover, camera, sol) {
  return {
    type: ADD_EMPTY_SOL,
    rover,
    camera,
    sol,
  };
}

export const ADD_MEANINGFUL_SOL = 'addMeaningfulSol';

function addMeaningfulSol(rover, camera, sol) {
  return {
    type: ADD_MEANINGFUL_SOL,
    rover,
    camera,
    sol,
  };
}

export const DISPLAY_NOT_FOUND = 'displayNotFound';

function displayNotFound(rover) {
  return {
    type: DISPLAY_NOT_FOUND,
    rover,
  };
}

export const REFRESH_ROVER_IMAGES = 'refreshRoverImages';

function refreshRoverImages(rover, camera) {
  return {
    type: REFRESH_ROVER_IMAGES,
    rover,
    camera,
  };
}

export const REQUEST_ROVERS_IMAGES = 'requestRoversImages';

function requestRoversImages(rover, camera, sol) {
  return {
    type: REQUEST_ROVERS_IMAGES,
    rover,
    camera,
    sol,
  };
}

export const RECEIVE_ROVER_IMAGES = 'receiveRoverImages';

function receiveRoverImages(rover, json) {
  // For earthDate, camera, cameraFullName, and sol we just need to get the data from
  // the first returned object because this data will stay the same for each photo
  // object from a request.
  return {
    type: RECEIVE_ROVER_IMAGES,
    rover,
    name: rover,
    earthDate: json.photos[0].earth_date,
    camera: json.photos[0].camera.name,
    cameraFullName: json.photos[0].camera.full_name,
    photos: json.photos,
    sol: json.photos[0].sol,
  };
}

export const ABORT_FETCH_LOOP = 'abortFetchLoop';

export function abortFetchLoop(rover, camera){
  console.log("abort fetch loop");
  return{
    type: ABORT_FETCH_LOOP,
    rover,
    camera,
  }
}

export const UNABORT_FETCH_LOOP = 'unabortFetchLoop';

export function unabortFetchLoop(rover, camera){
  console.log("abort fetch loop");
  return{
    type: UNABORT_FETCH_LOOP,
    rover,
    camera,
  }
}

// *********************************
// This is to avoid making another network request for
// photos on a day no photos we're taken
// ***********
function findSolNotInEmptySols(state, rover, cameraIndex, camera, cameraFullName, sol) {
  if (state.getDataByRover[rover][camera]['emptySols'].includes(sol)) {
    return function (dispatch) {
      dispatch(requestRoversImages(rover, camera, sol - 1));
      findSolNotInEmptySols(state, rover, cameraIndex, camera, cameraFullName, sol - 1);
    }
  } else {
    return function (dispatch) {
      dispatch(requestRoversImages(rover, camera, sol));
    };
  }
}

export function fetchRoverImages(rover, sol, page, camera, cameraFullName, cameraIndex) {
  return function (dispatch, getState) {
    if(getState().getDataByRover[rover][camera]['abortLoop']){
      return;
    } else {
      if (typeof getState().getDataByRover[rover][camera] !== 'undefined' && getState().getDataByRover[rover][camera]['emptySols'].includes(sol)) {
        dispatch(selectedACamera(...[rover, cameraIndex, camera, cameraFullName, sol,]));
        findSolNotInEmptySols(getState(), rover, cameraIndex, camera, cameraFullName, sol - 1);
      } else {
        dispatch(requestRoversImages(rover, camera, sol));
        dispatch(selectedACamera(...[rover, cameraIndex, camera, cameraFullName, sol,]));
      }
      const apiKeyIndex = getState().apiKeys['index'];
      const apiKey = getState().apiKeys.keys[apiKeyIndex];
      return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/` + rover + `/photos?sol=` + sol + `&camera=` + camera + `&page=` + page + `&api_key=` + apiKey).then(response => {
        const parameters = [rover, sol, page, camera, cameraFullName, cameraIndex];
        return handleErrors(response, fetchRoverImages, ...parameters);
      }).then(response => response.json()).then(json => {
        if (json.photos.length > 0) {
          const earthDate = json.photos[0].earth_date;
          dispatch(selectedACamera(rover, cameraIndex, camera, cameraFullName, sol, earthDate));
          dispatch(addMeaningfulSol(rover, camera, sol));
          return dispatch(receiveRoverImages(rover, json));
        } else {
          dispatch(addEmptySol(rover, camera, sol));
          return dispatch(fetchRoverImages(rover, sol - 1, page, camera, cameraFullName, cameraIndex));
        }
      }).catch((e) => console.log(e));
    }
  };
}

function shouldFetchRoverImages(state, rover, sol, camera) {
  if (typeof state.getDataByRover[rover][camera] === null || typeof state.getDataByRover[rover][camera] === 'undefined') {
    console.log('camera data does not exist');
    return true;
  } else if (typeof state.getDataByRover[rover][camera][sol] === 'undefined' || !state.getDataByRover[rover][camera][sol]['hasFetchedImages']) {
    console.log('sol data does not exist');
    return true;
  } else {
    console.log('this exists');
    return false;
  }
}

export function fetchRoverImagesIfNeeded(rover, sol, page, camera, cameraFullName, cameraIndex, earthDate) {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.
  return (dispatch, getState) => {
    dispatch(unabortFetchLoop(rover, camera));
    if (shouldFetchRoverImages(getState(), rover, sol, camera)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchRoverImages(rover, sol, page, camera, cameraFullName, cameraIndex, false));
    } else {
      // Let the calling code know there's nothing to wait for.
      dispatch(selectedACamera(rover, cameraIndex, camera, cameraFullName, sol, earthDate));
      return Promise.resolve();
    }
  };
}

export function fetchRoverImagesOnce(rover, sol, page, camera, cameraFullName, cameraIndex) {
  return function (dispatch) {
    dispatch(requestRoversImages(rover, camera, sol));
    console.log("should select a camera");
    dispatch(selectedACamera(...[rover, cameraIndex, camera, cameraFullName, sol,]));
    const apiKeyIndex = getState().apiKeys['index'];
    const apiKey = getState().apiKeys.keys[apiKeyIndex];
    return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/` + rover + `/photos?sol=` + sol + `&camera=` + camera + `&page=` + page + `&api_key=` + apiKey).then(response => {
      const parameters = [rover, sol, page, camera, cameraFullName, cameraIndex];
      handleErrors(response, fetchRoverImagesOnce, ...parameters);
    }).then(response => response.json()).then(json => {
      if (json.photos.length > 0) {
        const earthDate = json.photos[0].earth_date;
        dispatch(selectedACamera(rover, cameraIndex, camera, cameraFullName, sol, earthDate));
        dispatch(addMeaningfulSol(rover, camera, sol));
        return dispatch(receiveRoverImages(rover, json));
      } else {
        dispatch(displayNotFound(rover));
        return dispatch(selectedACamera(...[rover, cameraIndex, camera, cameraFullName, sol,]));
      }
    });
  };
}

export function fetchRoverImagesIfNeededOnce(rover, sol, page, camera, cameraFullName, cameraIndex) {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.
  return (dispatch, getState) => {
    if (shouldFetchRoverImages(getState(), rover, sol, camera)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchRoverImagesOnce(rover, sol, page, camera, cameraFullName, cameraIndex));
    } else {
      // Let the calling code know there's nothing to wait for.
      dispatch(displayNotFound(rover));
      dispatch(selectedACamera(...[rover, cameraIndex, camera, cameraFullName, sol,]));
      return Promise.resolve();
    }
  };
}

export const REQUEST_MORE_ROVER_IMAGES = 'requestMoreRoverImages';

function requestMoreRoverImages(rover, camera, sol, nextPage) {
  return {
    type: REQUEST_MORE_ROVER_IMAGES,
    rover,
    camera,
    sol,
    page: nextPage,
  };
}

export const RECEIVE_MORE_ROVER_IMAGES = 'receiveMoreRoverImages';

function receiveMoreRoverImages(rover, camera, sol, json) {
  return {
    type: RECEIVE_MORE_ROVER_IMAGES,
    rover,
    camera,
    sol,
    photos: json.photos,
  };
}

export const NO_MORE_ROVER_IMAGES = 'noMoreRoverImages';

function noMoreRoverImages(rover, camera, sol) {
  // For earthDate, camera, cameraFullName, and sol we just need to get the data from the first returned object
  // because this data will stay the same for each photo object from a Request
  return {
    type: NO_MORE_ROVER_IMAGES,
    rover,
    camera,
    sol,
  };
}

// export function fetchNextRoverImages(rover, sol, page, camera, cameraFullName, cameraIndex) {
//   // Note that the function also receives getState()
//   // which lets you choose what to dispatch next.
//   return dispatch => dispatch(fetchRoverImages(rover, sol, page, camera, cameraFullName, cameraIndex));
// }

export function fetchNextPhotoSet(rover, sol, camera, cameraFullName, cameraIndex) {
  return function (dispatch, getState) {
    const pageToFetch = getState().getDataByRover[rover][camera][sol]['page'] + 1;
    dispatch(requestMoreRoverImages(rover, camera, sol, pageToFetch));
    const apiKeyIndex = getState().apiKeys['index'];
    const apiKey = getState().apiKeys.keys[apiKeyIndex];
    return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/` + rover + `/photos?sol=` + sol + `&camera=` + camera + `&page=` + pageToFetch + `&api_key=` + apiKey).then(response => {
      const parameters = [rover, sol, camera, cameraFullName, cameraIndex];
      handleErrors(response, fetchNextPhotoSet, ...parameters);
    }).then(response => response.json()).then(json => {
      if (json.photos.length > 0) {
        const earthDate = json.photos[0].earth_date;
        dispatch(selectedACamera(rover, cameraIndex, camera, cameraFullName, sol, earthDate));
        return dispatch(receiveMoreRoverImages(rover, camera, sol, json));
      } else {
        return dispatch(noMoreRoverImages(rover, camera, sol));
      }
    });
  };
}

// LOOK AT http://redux.js.org/docs/introduction/Examples.html#real-world for ERROR MESSAGE HANDLING

// ************************************************************
// ******
//
//  Actions specific to Image Selection Functionality
//
// ******
// ***********************
// ************************************************************

export const SELECT_IMAGE = 'selectImage';

export function selectImage(index, photoId, imgSrc, rover, camera, cameraFullName, earthDate, sol) {
  return {
    type: SELECT_IMAGE,
    index,
    photoId,
    imgSrc,
    rover,
    camera,
    cameraFullName,
    earthDate,
    sol,
  };
}

export const UNSELECT_IMAGE = 'unselectImage';

export function unselectImage() {
  return {
    type: UNSELECT_IMAGE,
  };
}

