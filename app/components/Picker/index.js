/**
 *
 * Picker
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SelectARover from 'components/SelectARover';
import {Flex, Box} from 'grid-styled';
import Curiosity from 'assets/rovers/Curiosity.jpg';
import Opportunity from 'assets/rovers/Opportunity.jpg';
import Spirit from 'assets/rovers/Spirit.jpg';

class Picker extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            portrait: [{Curiosity}, {Opportunity}, {Spirit}]
        }
    }

    render(){
        return (
            <Flex>
                {this.props.values.map((value, i) =>
                    <Box flex={1} key={value.id}>
                        <SelectARover
                            portrait={this.state.portrait[i][value.name]}
                            name={value.name}
                            totalPhotos={value.total_photos}
                            activeState={this.props.activeState[i]}
                        />
                    </Box>
                )}
            </Flex>
        );
    }
}

Picker.propTypes = {
    values: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        total_photos: PropTypes.number,
    })).isRequired,
    activeState: PropTypes.arrayOf(PropTypes.bool).isRequired,
};

export default Picker;
