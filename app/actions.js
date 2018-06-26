// *****
// ** ACTIONS USED IN ALL PAGES
//

export const SELECTED_A_CAMERA = 'selectedCamera';

export function selectedACamera(rover, cameraIndex, camera, cameraFullName, sol, earthDate) {
    return {
        type: SELECTED_A_CAMERA,
        rover,
        cameraIndex,
        camera,
        cameraFullName,
        sol,
        earthDate,
    };
}

export const UNSELECTED_CAMERA = 'unselectedCamera';

export function unselectedCamera() {
    return {
        type: UNSELECTED_CAMERA,
    };
}


// ************************************************************
// ******
//
//  Error Handling Function
//
// ******
// ***********************
// ************************************************************

export const SWITCH_API_KEY = 'switchApiKey';

export function switchApiKey(currentIndex){
  return{
    type: SWITCH_API_KEY,
    exhaustedKey: currentIndex
  }
}

export function handleErrors(response, correspondingAction, parameters) {
  if (!response.ok) {
    if(response.status === 429){
      return function(getState, dispatch){
        dispatch(switchApiKey(getState.apiKeys.index));
        return dispatch(correspondingAction(parameters));
      }
    }
  } else {
    return response;
  }
}
