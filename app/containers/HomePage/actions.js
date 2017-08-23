// *****
// ** ACTIONS FOR INFORMATION OF ALL ROVERS
//

import fetch from 'isomorphic-fetch';

export const INVALIDATE_ALL_ROVERS = 'invalidateAllRovers';

export function invalidateAllRovers() {
  return {
    type: INVALIDATE_ALL_ROVERS,
  };
}

export const REQUEST_ALL_ROVERS_DATA = 'requestAllRoversData';

function requestAllRoversData() {
  return {
    type: REQUEST_ALL_ROVERS_DATA,
    isFetching: false,
  };
}

export const RECEIVE_ALL_ROVERS_DATA = 'receiveAllRoversData';

function receiveAllRoversData(json) {
  const dateReceivedOn = new Date();
  return {
    type: RECEIVE_ALL_ROVERS_DATA,
    simpleDataAboutAllRovers: json.rovers,
    dateReceived: dateReceivedOn,
  };
}

export function fetchAllRoversData() {
  return function (dispatch) {
    dispatch(requestAllRoversData());
    return fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=8m8bkcVYqxE5j0vQL2wk1bpiBGibgaqCrOvwZVyU`).then(response => response.json()).then(json => dispatch(receiveAllRoversData(json)));
  };
}

function shouldFetchAllRoverData(state) {
  const data = state.getAllRoversData.AllRovers.simpleDataAboutAllRovers;

  // Check if today is at least 24 hours greater than
  // the dateDataReceived time inside of rover Object
  let today;
  let dayAfterReceivedAt;
  if (!data) {
    today              = Date.now();
    const dateReceived = new Date(data.dateDataReceived);
    const time         = dateReceived.getTime();
    dayAfterReceivedAt = new Date(time + 24 * 60 * 60 * 1000);
    dayAfterReceivedAt = Date.parse(dayAfterReceivedAt);
  }
  // ** End

  if (!data) {
    return true;
  } else if (today >= dayAfterReceivedAt) {
    console.log("today is greater than received at")
    return true;
  } else if (data.isFetching) {
    return false;
  } else {
    return data.didInvalidate;
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
      return dispatch(fetchAllRoversData());
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve();
    }
  };
}
