/**
 *
 * RoverSimpleData
 *
 */

import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router';

const RoverColumn = styled.div`
    background-size: cover;
    background-position: 50%;
    height: 100vh;    
`

function SelectARover(props) {
    console.log(props.portrait);
    return (
        <RoverColumn style={{backgroundImage: "url(" + props.portrait + ")"}}>
            <h3>
                <Link to={"/r/" + props.name}>
                    {props.name}
                </Link>
            </h3>
            <p>{props.totalPhotos}</p>
        </RoverColumn>
    );
}

SelectARover.propTypes = {};

export default SelectARover;
