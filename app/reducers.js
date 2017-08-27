// *****
// ** REDUCERS USED FOR ACTIONS IN ALL PAGES
//

import { SELECTED_A_CAMERA, UNSELECTED_CAMERA } from './actions';

export function selectedCamera(state = {
    selected: false,
    rover: undefined,
    cameraIndex: undefined,
    camera: undefined,
    cameraFullName: undefined,
    sol: undefined,
    earthDate: undefined,
}, action) {
    switch (action.type) {
        case SELECTED_A_CAMERA:
            return Object.assign({}, state, {
                selected: true,
                rover: action.rover,
                cameraIndex: action.cameraIndex,
                camera: action.camera,
                cameraFullName: action.cameraFullName,
                sol: action.sol,
                earthDate: action.earthDate,
            });
        case UNSELECTED_CAMERA:
            return Object.assign({}, state, {
                selected: false,
            });
        default:
            return state;
    }
}

export function apiKeys(state={
  keys: ['8m8bkcVYqxE5j0vQL2wk1bpiBGibgaqCrOvwZVyU', 'a4q0jhngYKp9kn0cuwvKMHtKz7IrkKtFBRaiMv5t'],
  index: 0,
  keyIsExhausted: false,
}, action){
  switch(action.type.exhaustedKey){
    case 0:
      return Object.assign({}, state, {
        exhaustedKey: action.exhaustedKey,
        index: 1,
        keyIsExhausted: true,
      });
    case 1:
      return Object.assign({}, state, {
        exhaustedKey: action.exhaustedKey,
        index: 0,
        keyIsExhausted: true,
      });
    case 2:
      return Object.assign({}, state, {
        exhaustedKey: action.exhaustedKey,
        index: 0,
        keyIsExhausted: true,
      });
    default:
      return state;
  }
}