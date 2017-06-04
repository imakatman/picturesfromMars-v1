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

class SelectedRoverPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);

        this.state = {
            selectedRover: this.props.routeParams.selectedRover
        }
    }

    componentDidMount() {
        const {dispatch} = this.props;

        dispatch(selectRover(this.state.selectedRover));
        dispatch(fetchRoverDataIfNeeded(this.state.selectedRover));
    }

    render() {
        return (
            <div>
                <Helmet
                    title="SelectedRoverPage"
                    meta={[
                        {name: 'description', content: 'Description of SelectedRoverPage'},
                    ]}
                />
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
        isFetching,
        lastUpdated,
    };
}

SelectedRoverPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(SelectedRoverPage);
