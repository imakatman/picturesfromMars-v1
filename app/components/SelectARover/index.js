/**
 *
 * RoverSimpleData
 *
 */

import React from 'react';
// import styled from 'styled-components';

function SelectARover(props) {
    return (
        <span>
            <input type="radio" value={props.name} onClick={() => props.onClick}/>
            <h3>{props.name}</h3>
            <p>{props.totalPhotos}</p>
        </span>
    );
}

SelectARover.propTypes = {};

export default SelectARover;
