/*
 *
 * SelectedRoverPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {
    selectRover,
    fetchRoverDataIfNeeded,
    invalidateRover,
    fetchRoverImagesIfNeeded,
    fetchRoverImagesIfNeededOnce,
    fetchNextRoverImages,
    selectedCamera,
    unselectedCamera
} from '../../actions'
import {Flex, Box} from 'grid-styled';
import Gallery from 'components/Gallery';
import RoverDiagram from 'components/RoverDiagram';
import CameraNavigation from 'components/CameraNavigation';

const IntroLayer = styled(Flex)`
    background-color: #000;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;    
`;

const ActiveCameraLayer = styled(IntroLayer)`
    z-index: 1;    
`;

const NavigationBox = styled(Box)`
    flex: 1;
    position: relative;
`

const GalleryContain = styled(Box)`
    overflow-y: scroll;
`

const RoverName = styled.h1`
    color: #fff;
    position:absolute;
`;

const SearchForm = styled.form`
    position: absolute;
    bottom: 40px;
`

const Label = styled.label`
    color: #fff;
`


class SelectedRoverPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);

        this.state = {
            selectedRover: this.props.routeParams.rover,
            page: 1,
            value: ""
        }

        this.mountGallery            = this.mountGallery.bind(this);
        this.unmountGallery          = this.unmountGallery.bind(this);
        this.returnToPreviousDate    = this.returnToPreviousDate.bind(this);
        this.grabNextAvailablePhotos = this.grabNextAvailablePhotos.bind(this);
        this.datePicker = this.datePicker.bind(this);
    }

    componentWillMount() {
        const {dispatch, selectedRover, getDataByRover} = this.props;

        console.log("component will mount");

        dispatch(selectRover(this.state.selectedRover));
        return dispatch(fetchRoverDataIfNeeded(this.state.selectedRover));
    }

    componentDidMount() {
        const {selectedCamera} = this.props;

        if (typeof selectedCamera['selected'] === true) {
            return this.mountGallery(selectedCamera.rover, selectedCamera.cameraIndex, selectedCamera.camera, selectedCamera.sol);
        }
    }

    componentWillUpdate(){
        console.log("component will update");
    }

    componentDidUpdate(){
        console.log("component updated");
    }

    mountGallery(rover, cameraIndex, selectedCamera, cameraFullName, currentSol) {
        console.log("mount gallery");
        const {dispatch, selectedRover, getDataByRover, isFetching} = this.props;

        if (!isFetching) {

            const _selectedCamera = getDataByRover[selectedRover].data.cameras[cameraIndex].name;

            console.log(_selectedCamera);

            if (typeof getDataByRover[selectedRover][_selectedCamera] === 'undefined') {

                console.log("has not fetched images from this camera");

                const _rover          = rover || selectedRover,
                      _camera         = selectedCamera || _selectedCamera,
                      _cameraFullName = cameraFullName || getDataByRover[selectedRover].data.cameras[cameraIndex].full_name,
                      _sol            = currentSol || getDataByRover[selectedRover].data.max_sol,
                      _page           = this.state.page;

                return dispatch(fetchRoverImagesIfNeeded(_rover, _sol, _page, _camera, _cameraFullName, cameraIndex));

            } else if (!isFetching && getDataByRover[selectedRover][_selectedCamera]["hasFetchedImages"] === true) {

                console.log("has fetched images from this camera");

                const _rover          = rover || selectedRover,
                      _camera         = selectedCamera || _selectedCamera,
                      _cameraFullName = cameraFullName || getDataByRover[selectedRover].data.cameras[cameraIndex].full_name,
                      _sol            = currentSol || getDataByRover[selectedRover][_selectedCamera]["latestMeaningfulSol"],
                      _page           = this.state.page;

                console.log(_cameraFullName + " " + cameraIndex);

                return dispatch(fetchRoverImagesIfNeeded(_rover, _sol, _page, _camera, _cameraFullName, cameraIndex));

            }
        }

    }

    unmountGallery() {
        const {dispatch} = this.props;
        dispatch(unselectedCamera());
        return this.setState({
            galleryMounted: false,
        })
    }

    returnToPreviousDate() {
        console.log("return to previous date");

        const {dispatch, selectedRover, getDataByRover, selectedCamera} = this.props;

        const meaningfulSols = getDataByRover[selectedRover][selectedCamera['camera']]["meaningfulSols"];
        const i = meaningfulSols.indexOf(selectedCamera['sol']);

        return dispatch(selectedCamera(selectedRover, selectedCamera["cameraIndex"], selectedCamera["camera"], selectedCamera["cameraFullName"], meaningfulSols[i - 1], selectedCamera["earthDate"]));
    }

    grabNextAvailablePhotos(i) {
        const {dispatch, selectedRover, selectedCamera} = this.props;

        return dispatch(fetchNextRoverImages(selectedRover, selectedCamera['sol'] - 1, 1, selectedCamera['camera'], i));
    }

    datePicker(e){
        e.preventDefault();

        const {dispatch, selectedRover, selectedCamera} = this.props;

        console.log(this.state.value);
        return dispatch(fetchRoverImagesIfNeededOnce(selectedRover, this.state.value, 1, selectedCamera['camera'], selectedCamera['cameraIndex']));
    }

    render() {
        const {selectedRover, getDataByRover, isFetching, selectedCamera} = this.props;

        return (
            <div>
                <Helmet
                    title="Pictures From Mars"
                    meta={[
                        {name: 'description', content: 'Description of SelectedRoverPage'},
                    ]}
                />

                {selectedRover && <RoverName>{selectedRover}</RoverName>}

                { Object.keys(getDataByRover[selectedRover]['data']).length !== 0
                && getDataByRover[selectedRover]['isFetching'] === false
                || Object.keys(selectedCamera).length === 0
                || typeof selectedCamera['selected'] === false ? (
                        <IntroLayer>
                            <RoverDiagram
                                cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                                mountGallery={(i) =>
                                    this.mountGallery(...[, i, , ,])}
                                landing={true}
                            />
                        </IntroLayer>
                    ) : (
                        <IntroLayer>
                            <p>Loading...</p>
                        </IntroLayer>
                    )
                }

                {selectedCamera['selected'] === true
                && getDataByRover[selectedRover][selectedCamera['camera']][selectedCamera['sol']]['isFetching'] === false
                &&
                <ActiveCameraLayer>
                    <Flex direction="column" flex={1}>
                        <NavigationBox>
                            <CameraNavigation
                                rover={selectedRover}
                                cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                                mountGallery={(i) =>
                                    this.mountGallery(...[, i, , ,])}
                            />
                        </NavigationBox>
                        <NavigationBox>
                           <RoverDiagram
                               cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                               mountGallery={(i) =>
                                   this.mountGallery(...[, i, , ,])}
                               unmountGallery={() => this.unmountGallery()}
                               landing={false}
                           />
                            <SearchForm onSubmit={this.datePicker}>
                                <Label htmlFor="sol">
                                Sol:
                                <input type="text" value={this.state.value} onChange={(e)=>this.setState({value:e.target.value})}/>
                                </Label>
                                <input type="submit" value="Submit"/>
                            </SearchForm>
                        </NavigationBox>
                    </Flex>
                    <GalleryContain flex={2}>
                        <Gallery fetchingImagesState={getDataByRover[selectedRover][selectedCamera['camera']]["isFetching"]}
                            cameraAbbrev={selectedCamera["camera"]}
                            cameraFullName={getDataByRover[selectedRover][selectedCamera['camera']][selectedCamera["sol"]]["cameraFullName"]}
                            sol={selectedCamera["sol"]}
                            earthDate={selectedCamera["earthDate"]}
                            photos={getDataByRover[selectedRover][selectedCamera['camera']][selectedCamera["sol"]]["photoData"]}
                            returnToPreviousDate={()=>this.returnToPreviousDate()}
                            grabNextAvailablePhotos={(i) => this.grabNextAvailablePhotos(i)}
                        />
                    </GalleryContain>
                </ActiveCameraLayer>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {selectedRover, getDataByRover, selectedCamera} = state;

    // const {
    //           isFetching,
    //           lastUpdated,
    //           data: roverData
    //       } = getDataByRover[selectedRover] || {
    //     isFetching: true,
    //     data: []
    // }
    //
    // const {
    //           rover,
    //           cameraIndex,
    //           camera,
    //           sol,
    //       } = selectedCamera;

    return {
        selectedRover,
        getDataByRover,
        selectedCamera
    };
}

SelectedRoverPage.propTypes = {
    routeParams: PropTypes.objectOf(PropTypes.string).isRequired,
    selectedRover: PropTypes.string.isRequired,
    getDataByRover: PropTypes.objectOf(PropTypes.shape({
            didInvalidate: PropTypes.bool,
            isFetching: PropTypes.bool,
            lastUpdated: PropTypes.number,
            name: PropTypes.string,
            data: PropTypes.shape({
                cameras: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
                id: PropTypes.number,
                landing_date: PropTypes.string,
                launch_date: PropTypes.string,
                max_date: PropTypes.string,
                max_sol: PropTypes.number,
                name: PropTypes.string,
                status: PropTypes.string,
                total_photos: PropTypes.number,
            })
        })
    ).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(SelectedRoverPage);
