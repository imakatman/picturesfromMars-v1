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
import ReactDOM from 'react-dom';
import InsideRoverContainer from 'components/InsideRoverContainer';

class SelectedRoverPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);

        this.state = {
            selectedRover: this.props.routeParams.selectedRover
        }

        this.fetchImages = this.fetchImages.bind(this);
    }

    fetchImages(){

    }

    componentDidMount() {
        const {dispatch} = this.props;

        dispatch(fetchRoverDataIfNeeded(this.state.selectedRover));
        dispatch(selectRover(this.state.selectedRover));
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
                    <h1>{selectedRover}</h1>
                }
                {getDataByRover.Rover.data ? (
                    <p>{getDataByRover.Rover.data.landing_date}</p>
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

ReactDOM.render(<InsideRoverContainer/>, document.body);
export default connect(mapStateToProps)(SelectedRoverPage);
