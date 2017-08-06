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
        const {selectCamera} = this.props;

        if (typeof selectCamera['selected'] === true) {
            return this.mountGallery(selectCamera.rover, selectCamera.cameraIndex, selectCamera.camera, selectCamera.sol);
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
                      _page           = this.state.page,
                      _emptySols      = getDataByRover[selectedRover][_selectedCamera]["emptySols"];

                console.log(_sol);

                return dispatch(fetchRoverImagesIfNeeded(_rover, _sol, _page, _camera, _cameraFullName, cameraIndex, _emptySols));

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

        const {dispatch, selectedRover, getDataByRover, selectCamera} = this.props;

        const meaningfulSols = getDataByRover[selectedRover][selectCamera['camera']]["meaningfulSols"];
        const i = meaningfulSols.indexOf(selectCamera['sol']);

        return dispatch(selectedCamera(selectedRover, selectCamera["cameraIndex"], selectCamera["camera"], selectCamera["cameraFullName"], meaningfulSols[i - 1], selectCamera["earthDate"]));
    }

    grabNextAvailablePhotos(i) {
        const {dispatch, selectedRover, getDataByRover, selectCamera} = this.props;

        const _emptySols = getDataByRover[selectedRover][selectCamera['camera']]["emptySols"];

        return dispatch(fetchNextRoverImages(selectedRover, selectCamera['sol'] - 1, 1, selectCamera['camera'], i, _emptySols));
    }

    datePicker(e){
        e.preventDefault();

        const {dispatch, getDataByRover, selectedRover, selectCamera} = this.props;

        const _emptySols = getDataByRover[selectedRover][selectCamera['camera']]["emptySols"];

        console.log(this.state.value);
        return dispatch(fetchRoverImagesIfNeeded(selectedRover, this.state.value, 1, selectCamera['camera'], selectCamera['cameraIndex'], _emptySols));
    }

    render() {
        const {selectedRover, getDataByRover, isFetching, selectCamera} = this.props;

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
                || Object.keys(selectCamera).length === 0
                || typeof selectCamera['selected'] === false ? (
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

                {selectCamera['selected'] === true
                && getDataByRover[selectedRover][selectCamera['camera']][selectCamera['sol']]['isFetching'] === false
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
                        <Gallery fetchingImagesState={getDataByRover[selectedRover][selectCamera['camera']]["isFetching"]}
                            cameraAbbrev={selectCamera["camera"]}
                            cameraFullName={getDataByRover[selectedRover][selectCamera['camera']][selectCamera["sol"]]["cameraFullName"]}
                            sol={selectCamera["sol"]}
                            earthDate={selectCamera["earthDate"]}
                            photos={getDataByRover[selectedRover][selectCamera['camera']][selectCamera["sol"]]["photoData"]}
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
    const {selectedRover, getDataByRover, selectCamera} = state;

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
    //       } = selectCamera;

    return {
        selectedRover,
        getDataByRover,
        selectCamera
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
