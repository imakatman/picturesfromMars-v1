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
} from './actions'
import Helmet from 'react-helmet';

export class SelectedRoverPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
                    title="SelectedRoverPage"
                    meta={[
                        {name: 'description', content: 'Description of SelectedRoverPage'},
                    ]}
                />
            </div>
        );
    }
}

SelectedRoverPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(SelectedRoverPage);
