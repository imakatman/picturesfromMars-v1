/*
 *
 * RoversApp
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {
    fetchAllRoverDataIfNeeded,
    unselectedCamera
} from './actions';
import Picker from 'components/Picker';

class RoversApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clickStateOfRovers: Array(3).fill(false)
        };
    }

    componentWillMount() {
        const {dispatch} = this.props;

        dispatch(fetchAllRoverDataIfNeeded());
        dispatch(unselectedCamera());
    }

    render() {
        const {getAllRoversData} = this.props;

        return (
            <div>
                <Helmet
                    title="Pictures From Mars"
                    meta={[
                        {name: 'description', content: ''},
                    ]}
                />
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

    const { getAllRoversData } = state;

    return {
        getAllRoversData,
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

