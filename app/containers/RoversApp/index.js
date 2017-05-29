/*
 *
 * RoversApp
 *
 */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {
    fetchAllRoverDataIfNeeded,
    invalidateAllRovers,
    selectRover,
    fetchRoverDataIfNeeded,
    invalidateRover
} from './actions'
import Picker from 'components/Picker'
import InsideRoverContainer from 'components/InsideRoverContainer'

class RoversApp extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const {dispatch, getAllRoversData} = this.props;

        dispatch(fetchAllRoverDataIfNeeded());
    }

    handleClick(selectedRover) {
        console.log("click!");
    }
x
    render() {
        const {getAllRoversData, isFetchingAll} = this.props;

        return (
            <div>
                {getAllRoversData.AllRovers.simpleDataAboutAllRovers &&
                    <Picker
                        onClick={() => this.handleClick()}
                        values={getAllRoversData.AllRovers.simpleDataAboutAllRovers} />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {

    const {selectedRover, getDataByRover, getAllRoversData} = state;

    const {
              isFetching,
              lastUpdated,
              data: roverData
          } = getDataByRover[selectedRover] || {
        isFetching: true,
        data: []
    }

    const {
              isFetchingAll,
              lastUpdatedAll,
              simpleDataAboutAllRovers: allRoversData
          } = getAllRoversData || {
        isFetchingAll: true,
        simpleDataAboutAllRovers: []
    }

    return {
        selectedRover,
        roverData,
        getAllRoversData,
        isFetching,
        isFetchingAll,
        lastUpdated,
        lastUpdatedAll
    };
}

RoversApp.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(RoversApp);
