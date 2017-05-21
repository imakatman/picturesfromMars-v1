/**
 *
 * InsideRoverContainer
 *
 */

import React, {PropTypes} from 'react'
// import styled from 'styled-components';

class InsideRoverContainer extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            name: "",
        }
    }

    componentDidMount(){
        this.setState({
            name: this.props.name
        })
    }

    render(){
        return (
            <div>
                <h4>{this.state.name}</h4>
            </div>
        );
    }
}

InsideRoverContainer.propTypes = {
    name: PropTypes.string.isRequired
};

export default InsideRoverContainer;
