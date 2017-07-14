/**
 *
 * Picker
 *
 */

import React from 'react';
import SelectARover from 'components/SelectARover';
import {Flex, Box} from 'grid-styled';
import Curiosity from 'assets/rovers/Curiosity.jpg';
import Opportunity from 'assets/rovers/Opportunity.jpg';
import Spirit from 'assets/rovers/Spirit.jpg';

class Picker extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            portraitObjects: [{Curiosity}, {Opportunity}, {Spirit}],
            portrait: []
        }
    }

    componentDidMount(){
        this.state.portraitObjects.map(portrait=>{
             const key = Object.keys(portrait)[0];
             const portraitValue = portrait[key];
             const portraitArray = this.state.portrait.concat(portraitValue);
             this.setState({ portrait: portraitArray });
        });
    }

    render(){
        return (
            <Flex>
                {this.props.values.map((value, i) =>
                    <Box flex={1} key={value.id}>
                        <SelectARover
                            portrait={this.state.portrait[i]}
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

Picker.propTypes = {};

export default Picker;
