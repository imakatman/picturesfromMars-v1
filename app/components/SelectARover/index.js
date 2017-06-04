/**
 *
 * RoverSimpleData
 *
 */

import React from 'react';
import {Link} from 'react-router';

function SelectARover(props) {
    return (
        <div>
            <h3>
                <Link to={"/r/" + props.name}>
                    {props.name}
                </Link>
            </h3>
            <p>{props.totalPhotos}</p>
        </div>
    );
}

SelectARover.propTypes = {};

export default SelectARover;
