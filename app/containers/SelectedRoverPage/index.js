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
    fetchRoverImagesIfNeeded
} from '../../actions'
import Helmet from 'react-helmet';
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
            page: 1
        }

        this.fetchPictures = this.fetchPictures.bind(this);
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

    fetchPictures(i) {
        const {dispatch, getDataByRover} = this.props;

        const rover  = this.state.selectedRover,
              maxSol = this.state.data.max_sol,
              camera = this.state.data.cameras[i].name,
              page = this.state.page;

        const photos = {};

        dispatch(fetchRoverImagesIfNeeded(rover, maxSol, page, camera));
        for (var [key, value] of Object.entries(getDataByRover[rover][camera].photoData)) {
            if (value["id"]) photos["id"] = value["id"];
            if (value["img_src"]) photos["img_src"] = value["img_src"];
            this.setState({
                photos
            });
        }

        this.setState((prevState)=>{
            page: prevState + 1
        });

    }

    render() {
        const {selectedRover, getDataByRover} = this.props;

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
                {getDataByRover[selectedRover].data ? (
                        <PicsNavigation
                            rover={this.state.selectedRover}
                            latestEarthDate={this.state.data.max_date}
                            cameras={this.state.data.cameras}
                            fetchPictures={(i) => this.fetchPictures(i)} />
                    ) : (
                        <p>Loading...</p>
                    )
                }
                <InsideRoverContainer name={this.state.selectedRover}/>

            </div>
        );
    }
}

function mapStateToProps(state) {
    const {selectedRover, getDataByRover} = state;

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

    return {
        selectedRover,
        roverData,
        roverPhotos,
        getDataByRover,
        isFetching,
        lastUpdated,
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
