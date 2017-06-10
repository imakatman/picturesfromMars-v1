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
    invalidateRover
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

    fetchPictures(){

    }

    componentDidMount() {
        const {dispatch} = this.props;

        dispatch(fetchRoverDataIfNeeded(this.state.selectedRover));
        dispatch(selectRover(this.state.selectedRover));
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
                {getDataByRover.Rover.data ? (
                    <PicsNavigation cameras={getDataByRover.Rover.data.cameras} fetchPictures={(i)=>fetchPictures()}/>
                    ) : (
                        <p>Loading...</p>
                    )
                }
                <InsideRoverContainer/>
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
