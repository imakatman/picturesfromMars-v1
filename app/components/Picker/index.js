/**
 *
 * Picker
 *
 */

import React from 'react';
import SelectARover from 'components/SelectARover';

function Picker(props) {
    return (
        <div>
            {props.values.map((value, i) =>
                <SelectARover
                    key={value.id}
                    name={value.name}
                    totalPhotos={value.total_photos}
                    activeState={props.activeState[i]}
                />
            )}
        </div>
    );
}

Picker.propTypes = {};

export default Picker;
