/**
 *
 * Picker
 *
 */

import React from 'react';
import SelectARover from 'components/SelectARover';

function Picker(props) {
    console.log(props.values);
    return (
        <form>
            {props.values.map(value =>
                <SelectARover
                    key={value.id}
                    name={value.name}
                    totalPhotos={value.total_photos}
                    onClick={() => value.onClick()}
                />
            )}
        </form>
    );
}

Picker.propTypes = {};

export default Picker;
