import React from 'react';
// import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { selectRover, fetchRoverDataIfNeeded, invalidateRover} from '../../actions'

class AsyncApp extends React.Component {
    constructor(props) {
        super(props);
        //this.handleChange = this.handleChange.bind(this)
        //this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }

    componentDidMount() {
        const { dispatch, selectedRover } = this.props;

        dispatch(fetchRoverDataIfNeeded(selectedRover))
        // dispatch(fetchRoversData(selectedRover));
    }

    // componentDidUpdate(prevProps) {
    //     if (this.props.selectedRover !== prevProps.selectedRover) {
    //         const { dispatch, selectedRover } = this.props
    //         dispatch(fetchRoverDataIfNeeded(selectedRover))
    //     }
    // }

    // handleChange(differentRover) {
    //     this.props.dispatch(selectRover(differentRover))
    //     this.props.dispatch(fetchRoverDataIfNeeded(differentRovereddit))
    // }
    //
    // handleRefreshClick(e) {
    //     e.preventDefault()
    //
    //     const { dispatch, selectedRover} = this.props
    //     dispatch(invalidateRover(selectedRover))
    //     dispatch(fetchRoverDataIfNeeded(selectedRover))
    // }

    render() {
        console.log(this.props);
        const { selectedRover, roversData, isFetching, lastUpdated } = this.props;
        return (
            <div>
                <h1>Hey</h1>
            </div>
        )
    }
}

// AsyncApp.propTypes = {
//     selectedRover: PropTypes.string.isRequired,
//     roversData: PropTypes.array.isRequired,
//     isFetching: PropTypes.bool.isRequired,
//     lastUpdated: PropTypes.number,
//     dispatch: PropTypes.func.isRequired
// }

function mapStateToProps(state) {
    const { selectedRover, getDataByRover } = state;
    const {data: roversData} =  getDataByRover[selectedRover];
    // const {items: roversData} = getDataByRover[selectedRover];

    return {
        selectedRover,
        roversData
    };
}

export default connect(mapStateToProps)(AsyncApp);
// export default AsyncApp;