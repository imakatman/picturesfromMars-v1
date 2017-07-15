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
import PicsNavigation from 'components/PicsNavigation';

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

        this.mountGallery  = this.mountGallery.bind(this);
    }

    componentWillMount() {
        const {dispatch, getDataByRover} = this.props;
        const rover                      = this.state.selectedRover;

        const data = {};

        dispatch(selectRover(rover));
        dispatch(fetchRoverDataIfNeeded(rover));

        for (var [key, value] of Object.entries(getDataByRover[rover].data)) {
            data[key] = value;
            this.setState({
                data
            });
        }
    }

    // mountGallery(i) {
    //     const thisCamera = this.state.data.cameras[i].name;
    //     this.fetchPictures(i);
    //     console.log(thisCamera);
    // }

    mountGallery(i) {
        const {dispatch, getDataByRover} = this.props;

        const rover  = this.state.selectedRover,
              sol = this.state.data.max_sol,
              camera = this.state.data.cameras[i].name,
              page   = this.state.page;

        const photos = [];

        this.setState({
            Gallery: <Gallery camera={camera} />
        });

        dispatch(cameraSelected(rover, camera, sol));
        dispatch(fetchRoverImagesIfNeeded(rover, sol, page, camera));

        for (var [key, value] of Object.entries(getDataByRover[rover][camera].photoData)) {
            const photo = {};
            if (value["id"]) photo["id"] = value["id"];
            if (value["img_src"]) photo["img_src"] = value["img_src"];
            if (value["rover"]["name"]) photo["roverName"] = value["rover"]["name"];
            if (value["camera"]["full_name"]) photo["camera"] = value["camera"]["full_name"];
            photos.push(photo);
        }

        console.log(photos);

        this.setState({
            Gallery: <Gallery camera={camera} photos={photos}/>
        });

        this.setState((prevState) => {
            page: prevState + 1
        });

    }

    render() {
        const {selectedRover, getDataByRover} = this.props;
        const GalleryComponent = this.state.Gallery;

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
                {GalleryComponent}
                {getDataByRover[selectedRover].data ? (
                        <PicsNavigation
                            rover={this.state.selectedRover}
                            latestEarthDate={this.state.data.max_date}
                            cameras={this.state.data.cameras}
                            mountGallery={(i) => this.mountGallery(i)} />
                    ) : (
                        <p>Loading...</p>
                    )
                }
                <InsideRoverContainer name={this.state.selectedRover} />

            </div>
        );
    }
}

function mapStateToProps(state) {
    const {selectedRover, getDataByRover, selectCamera} = state;

    const {
              isFetching,
              lastUpdated,
              data: roverData,
              photos: roverPhotos,
          } = getDataByRover[selectedRover] || {
        isFetching: true,
        data: [],
        photos: []
    }

    const {
        rover,
        camera,
        sol,
    } = selectCamera || {
        rover: undefined,
        camera: undefined,
        sol: undefined
    }

    return {
        selectedRover,
        roverData,
        roverPhotos,
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
