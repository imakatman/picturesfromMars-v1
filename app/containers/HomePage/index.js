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
    const { dispatch } = this.props;

    dispatch(fetchAllRoverDataIfNeeded());
    return dispatch(unselectedCamera());
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
  const { getAllRoversData } = state;

  return { getAllRoversData };
}

RoversApp.propTypes = {
  routeParams: PropTypes.objectOf(PropTypes.string).isRequired,
  selectedRover: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(RoversApp);

