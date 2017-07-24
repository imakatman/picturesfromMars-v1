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
    cameraSelected,
    cameraUnselected
} from '../../actions'
import {Flex, Box} from 'grid-styled';
import Gallery from 'components/Gallery';
import RoverDiagram from 'components/RoverDiagram';
import CameraNavigation from 'components/CameraNavigation';

const Loading = styled.div`
`;

const ActiveCameraLayer = styled(Flex)`
    background-color: #000;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;    
`;

const GalleryContain = styled(Box)`
    overflow-y: scroll;
`

const RoverName = styled.h1`
    color: #fff;
    position:absolute;
`;

class SelectedRoverPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);

        this.state = {
            selectedRover: this.props.routeParams.rover,
            page: 1,
        }

        this.mountGallery   = this.mountGallery.bind(this);
        this.unmountGallery = this.unmountGallery.bind(this);
    }

    componentWillMount() {
        const {dispatch, selectedRover, getDataByRover} = this.props;

        dispatch(selectRover(this.state.selectedRover));
        dispatch(fetchRoverDataIfNeeded(this.state.selectedRover));
    }

    componentDidMount() {
        const {selectCamera} = this.props;

        if (typeof selectCamera['selected'] === true || Object.keys(selectCamera).length !== 0) {
            this.mountGallery(selectCamera.rover, selectCamera.cameraIndex, selectCamera.camera, selectCamera.sol);
        }
    }

    mountGallery(rover, cameraIndex, selectedCamera, cameraFullName, currentSol, currentEarthDate) {
        const {dispatch, selectedRover, getDataByRover, isFetching} = this.props;

        if (!isFetching) {

            console.log(getDataByRover[selectedRover].data);

            const _rover  = rover || selectedRover,
                  _sol    = currentSol || getDataByRover[selectedRover].data.max_sol,
                  _camera = selectedCamera || getDataByRover[selectedRover].data.cameras[cameraIndex].name,
                  _cameraFullName = cameraFullName || getDataByRover[selectedRover].data.cameras[cameraIndex].full_name,
                  _page   = this.state.page;

            dispatch(fetchRoverImagesIfNeeded(_rover, _sol, _page, _camera, _cameraFullName, cameraIndex));

            this.setState((prevState) => {
                page: prevState + 1
            });

        }

    }

    unmountGallery() {
        const {dispatch} = this.props;
        dispatch(cameraUnselected());
        this.setState({
            galleryMounted: false,
        })
    }

    render() {
        const {selectedRover, getDataByRover, isFetching, selectCamera} = this.props;

        return (
            <div>
                <Helmet
                    title="SelectedRoverPage"
                    meta={[
                        {name: 'description', content: 'Description of SelectedRoverPage'},
                    ]}
                />

                {selectedRover && <RoverName>{selectedRover}</RoverName>}

                { Object.keys(getDataByRover[selectedRover]['data']).length !== 0
                && getDataByRover[selectedRover]['isFetching'] === false
                || Object.keys(selectCamera).length === 0
                || typeof selectCamera['selected'] === false ? (
                        <RoverDiagram
                            cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                            mountGallery={(i) => this.mountGallery(...[ ,i, , , , ])}
                        />) : (
                        <Loading>Loading...</Loading>
                    )
                }

                {selectCamera['selected'] === true
                && getDataByRover[selectedRover][selectCamera['camera']][selectCamera['sol']]['isFetching'] === false
                &&
                <ActiveCameraLayer>
                        <GalleryContain flex={2}>
                            <Gallery cameraAbbrev={selectCamera["camera"]}
                                cameraFullName={getDataByRover[selectedRover][selectCamera['camera']][selectCamera["sol"]]["cameraFullName"]}
                                photos={getDataByRover[selectedRover][selectCamera['camera']][selectCamera["sol"]]["photoData"]}
                                unmountGallery={() => this.unmountGallery()} />
                        </GalleryContain>
                        <Flex direction="column" flex={1}>
                            <Box>
                                <CameraNavigation
                                    rover={selectedRover}
                                    cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                                    mountGallery={(i) => this.mountGallery(...[ ,i, , , , ])} />
                            </Box>
                            <Box>
                                <RoverDiagram
                                    cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                                    mountGallery={(i) => this.mountGallery(...[ ,i, , , , ])} />
                            </Box>
                        </Flex>
                </ActiveCameraLayer>
                }

            </div>
        );
    }
}

function mapStateToProps(state) {
    const {selectedRover, getDataByRover, selectCamera} = state;

    const {
              isFetching,
              lastUpdated,
              data: roverData
          } = getDataByRover[selectedRover] || {
        isFetching: true,
        data: []
    }

    const {
              rover,
              cameraIndex,
              camera,
              sol,
          } = selectCamera || {}

    return {
        selectedRover,
        roverData,
        getDataByRover,
        isFetching,
        lastUpdated,
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
