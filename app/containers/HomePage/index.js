/*
 *
 * RoversApp
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import RoverPicker from 'components/RoverPicker';

import { fetchAllRoverDataIfNeeded } from './actions';
import { unselectedCamera } from '../../actions';

class RoversApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clickStateOfRovers: Array(3).fill(false),
    };
  }

  componentWillMount() {
    const { dispatch, selectedCamera } = this.props;

    if (selectedCamera.selected === true) {
      dispatch(fetchAllRoverDataIfNeeded());
      return dispatch(unselectedCamera());
    } else {
      return dispatch(fetchAllRoverDataIfNeeded());
    }
  }

  render() {
    const { getAllRoversData } = this.props;

    return (
      <div>
        <Helmet
          title="Pictures From Mars"
          meta={[
            { name: 'description', content: '' },
          ]}
        />
        {getAllRoversData.AllRovers.simpleDataAboutAllRovers &&
        <RoverPicker
          activeState={this.state.clickStateOfRovers}
          values={getAllRoversData.AllRovers.simpleDataAboutAllRovers} />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { getAllRoversData, selectedCamera, routing } = state;

  return { getAllRoversData, selectedCamera, routing };
}

RoversApp.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedCamera: PropTypes.object,
  getAllRoversData: PropTypes.shape({
    AllRover: PropTypes.shape({
      didInvalidateAll: PropTypes.bool.isRequired,
      isFetchingAll: PropTypes.bool.isRequired,
      lastUpdatedAll: PropTypes.number.isRequired,
      simpleDataAboutAllRovers: PropTypes.arrayOf(PropTypes.shape({
        cameras: PropTypes.array.isRequired,
        id: PropTypes.number.isRequired,
        landing_date: PropTypes.string.isRequired,
        launch_date: PropTypes.string.isRequired,
        max_date: PropTypes.string.isRequired,
        max_sol: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        total_photos: PropTypes.number.isRequired,
      }))
    })
  })
};

export default connect(mapStateToProps)(RoversApp);

