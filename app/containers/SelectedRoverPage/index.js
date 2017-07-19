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
import InsideRoverContainer from 'components/InsideRoverContainer';
import CameraNavigation from 'components/CameraNavigation';

const RoverName = styled.h1`
    position: absolute;
`

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

        if (selectCamera["camera"] !== 'undefined') {
            this.mountGallery(selectCamera.rover, selectCamera.cameraIndex, selectCamera.camera, selectCamera.sol);
        }
    }


    mountGallery(rover, cameraIndex, selectedCamera, currentSol) {
        const {dispatch, selectedRover, getDataByRover, isFetching} = this.props;

        if (!isFetching) {
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
                {selectedRover &&
                <RoverName>{selectedRover}</RoverName>
                }
                {typeof selectCamera['camera'] !== 'undefined' &&
                    !getDataByRover[selectedRover][selectCamera['camera']]["isFetching"] &&
                <Gallery camera={selectCamera["camera"]} photos={getDataByRover[selectedRover][selectCamera["camera"]]["photoData"]}
                    unmountGallery={() => this.unmountGallery()} />
                }
                {!isFetching && getDataByRover[selectedRover]["data"] ? (
                        <div>
                            <CameraNavigation
                                rover={selectedRover}
                                latestEarthDate={getDataByRover[selectedRover]["data"]["max_date"]}
                                cameras={getDataByRover[selectedRover]["data"]["cameras"]}
                                mountGallery={(i) => this.mountGallery(...[, i, , ,])} />
                            <InsideRoverContainer name={selectedRover} />
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )
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
