import React from 'react';
// import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { selectRover, fetchRoversData, fetchRoverDataIfNeeded, invalidateRover } from '../../actions'

class AsyncApp extends React.Component {
    constructor(props) {
        super(props);

        console.log(this.props);
    }

    componentDidMount() {

        const { dispatch, selectedRover } = this.props;

        // dispatch(fetchRoversData(selectedRover));
        dispatch(fetchRoverDataIfNeeded(selectedRover));

    }

    render() {
        const { selectedRover, roverData } = this.props;

        console.log("updated");

        return (
            <div>
                <h1>{selectedRover}</h1>
                <p>{roverData}</p>
            </div>
        )
    }
}

function mapStateToProps(state) {

    console.log(state.selectedRover);

    const { selectedRover, getDataByRover } = state;

    return {
        selectedRover,
        getDataByRover
    };
}

export default connect(mapStateToProps)(AsyncApp);