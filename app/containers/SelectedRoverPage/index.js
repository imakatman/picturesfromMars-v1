/*
 *
 * SelectedRoverPage
 *
 */

import React, {PropTypes} from 'react';
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

class SelectedRoverPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);

        this.state = {
            selectedRover: this.props.routeParams.selectedRover
        }

        this.fetchPictures = this.fetchPictures.bind(this);
    }

    fetchPictures(i) {
        const {dispatch} = this.props;

        const rover = this.state.selectedRover,
            maxSol = this.state.data.max_sol,
            camera = this.state.data.cameras[i].name;

        console.log("fetch pictures");

        dispatch(fetchRoverImagesIfNeeded(rover, maxSol, camera));
    }

    componentDidMount() {
        const {dispatch, getDataByRover} = this.props;
        const rover = this.state.selectedRover;

        const data = {};

        dispatch(selectRover(rover));
        dispatch(fetchRoverDataIfNeeded(rover));

        for (var [key, value] of Object.entries(getDataByRover[rover].data)) {
            data[key]  = value;
            this.setState({
                data
            });
        }
    }

    render() {
        console.log("selected rover page");

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
                <h1>{selectedRover}</h1>
                }
                {getDataByRover[selectedRover].data ? (
                        <PicsNavigation cameras={getDataByRover[selectedRover].data.cameras}
                            fetchPictures={(i) => this.fetchPictures(i)} />
                    ) : (
                        <p>Loading...</p>
                    )
                }
                <InsideRoverContainer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {selectedRover, getDataByRover} = state;

    const {
              isFetching,
              lastUpdated,
              data: roverData
          } = getDataByRover[selectedRover] || {
        isFetching: true,
        data: []
    }

    return {
        selectedRover,
        roverData,
        getDataByRover,
        isFetching,
        lastUpdated,
    };
}

SelectedRoverPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(SelectedRoverPage);
