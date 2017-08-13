// *****
// ** ACTIONS USED IN ALL PAGES
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