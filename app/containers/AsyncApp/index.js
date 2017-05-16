import React from 'react';
// import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { selectRover, fetchRoverDataIfNeeded, invalidateRover } from '../../actions'

class AsyncApp extends React.Component {
    constructor(props) {
        super(props);

        console.log(this.props);
    }

    componentDidMount() {

        const { dispatch, selectedRover } = this.props;

        // dispatch(fetchRoversData(selectedRover));
        // dispatch(selectRover("Curiosity"));
        dispatch(fetchRoverDataIfNeeded("Curiosity"));
    }

    componentDidUpdate(prevProps) {
        // console.log(prevProps);

        // if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
        //     const { dispatch, selectedSubreddit } = this.props
        //     dispatch(fetchPostsIfNeeded(selectedSubreddit))
        // }
    }

    render() {
        const { selectedRover, roverData } = this.props;

        // console.log("updated");

        return (
            <div>
                <h1>{selectedRover}</h1>
                <p>{roverData}</p>
            </div>
        )
    }
}

function mapStateToProps(state) {

    const { selectedRover, getDataByRover } = state;

    // console.log("map state to props");

    // console.log(state);

    // const {
    //           isFetching,
    //           lastUpdated,
    //           data: roverData
    //       } = getDataByRover[selectedRover] || {
    //     isFetching: true,
    //     data: []
    // }

    return {
        selectedRover,
        getDataByRover,
    };
}

export default connect(mapStateToProps)(AsyncApp);