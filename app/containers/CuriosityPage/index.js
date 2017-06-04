/*
 *
 * CuriosityPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

export class CuriosityPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);

        this.state = {
            selectedRover: this.props.routeParams.dynamic
        }
    }

    componentDidMount() {
        const {dispatch, fetchRoverDataIfNeeded} = this.props;

        dispatch(fetchRoverDataIfNeeded(this.state.selectedRover));
    }

    render() {
        return (
            <div>
                <Helmet
                    title="CuriosityPage"
                    meta={[
                        {name: 'description', content: 'Description of CuriosityPage'},
                    ]}
                />
            </div>
        );
    }
}

CuriosityPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(CuriosityPage);

