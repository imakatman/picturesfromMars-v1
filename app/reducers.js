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
