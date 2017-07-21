/*
 *
 * SelectedRoverPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
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
import Helmet from 'react-helmet';
import Gallery from 'components/Gallery';
import RoverDiagram from 'components/RoverDiagram';
import CameraNavigation from 'components/CameraNavigation';

const Loading = styled.div`
`;

const RoverName = styled.h1`
    position: absolute;
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

        if (typeof selectCamera["camera"] !== 'undefined' || Object.keys(selectCamera).length !== 0 && selectCamera.constructor === Object) {
            this.mountGallery(selectCamera.rover, selectCamera.cameraIndex, selectCamera.camera, selectCamera.sol);
        }
    }


    mountGallery(rover, cameraIndex, selectedCamera, currentSol) {
        const {dispatch, selectedRover, getDataByRover, isFetching} = this.props;

        console.log("on click");

        if (!isFetching) {

            console.log(getDataByRover[selectedRover].data);

            const _rover  = rover || selectedRover,
                  _sol    = currentSol || getDataByRover[selectedRover].data.max_sol,
                  _camera = selectedCamera || getDataByRover[selectedRover].data.cameras[cameraIndex].name,
                  _page   = this.state.page;

            dispatch(cameraSelected(_rover, cameraIndex, _camera, _sol));
            dispatch(fetchRoverImagesIfNeeded(_rover, _sol, _page, _camera));

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
                {!isFetching && getDataByRover[selectedRover]["data"] &&
                Object.keys(selectCamera).length === 0 ||
                    typeof selectCamera['selected'] !== 'undefined' ? (
                    <RoverDiagram
                        cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                        mountGallery={(i) => this.mountGallery(...[, i, , ,])}
                    /> ) : (
                        <Loading>Loading...</Loading>
                    )
                }
                {typeof selectCamera['selected'] &&
                typeof selectCamera['camera'] === 'undefined' &&
                typeof getDataByRover[selectedRover][selectCamera['camera']]['isFetching'] == false &&
                    <Gallery camera={selectCamera["camera"]} photos={getDataByRover[selectedRover][selectCamera["camera"]]["photoData"]}
                        unmountGallery={() => this.unmountGallery()} />
                }
                {typeof selectCamera['selected'] &&
                    <CameraNavigation
                        rover={selectedRover}
                        cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                        mountGallery={(i) => this.mountGallery(...[, i, , ,])} />
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
