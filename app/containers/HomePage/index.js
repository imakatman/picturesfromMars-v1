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
} from '../../actions'
import Picker from 'components/Picker'
import InsideRoverContainer from 'components/InsideRoverContainer'

class RoversApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clickStateOfRovers: Array(3).fill(false)
        }

        // this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        const {dispatch} = this.props;

        dispatch(fetchAllRoverDataIfNeeded());
    }

    // handleClick(i) {
    //     const {dispatch, getAllRoversData} = this.props;
    //     const selectedRover = getAllRoversData.AllRovers.simpleDataAboutAllRovers[i].name;
    //
    //     dispatch(selectRover(selectedRover));
    // }

    render() {
        const {dispatch, getAllRoversData, isFetchingAll} = this.props;

        return (
            <div>
                {getAllRoversData.AllRovers.simpleDataAboutAllRovers &&
                    <Picker
                        activeState={this.state.clickStateOfRovers}
                        values={getAllRoversData.AllRovers.simpleDataAboutAllRovers} />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {

    const {selectedRover, getDataByRover, getAllRoversData, route} = state;

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
    // routeParams: PropTypes.objectOf(PropTypes.string).isRequired,
    // selectedRover: PropTypes.string.isRequired,
    // getDataByRover: PropTypes.objectOf(PropTypes.shape({
    //         didInvalidate: PropTypes.bool,
    //         isFetching: PropTypes.bool,
    //         lastUpdated: PropTypes.number,
    //         name: PropTypes.string,
    //         data: PropTypes.shape({
    //             cameras: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    //             id: PropTypes.number,
    //             landing_date: PropTypes.string,
    //             launch_date: PropTypes.string,
    //             max_date: PropTypes.string,
    //             max_sol: PropTypes.number,
    //             name: PropTypes.string,
    //             status: PropTypes.string,
    //             total_photos: PropTypes.number,
    //         })
    //     })
    // ).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(RoversApp);

