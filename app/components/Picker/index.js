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
            portrait: [{Curiosity}, {Opportunity}, {Spirit}]
        }
    }

    // componentWillMount(){
    //     var portraitArray = [];
    //     this.state.portraitObjects.map(portraitObj=>{
    //          const key = Object.keys(portraitObj)[0];
    //          portraitArray = this.state.portrait.concat(portraitObj[key]);
    //         console.log(portraitArray);
    //     });
    //
    //     this.setState({ portrait: portraitArray });
    // }

    render(){
        console.log(this.state.portrait);
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

Picker.propTypes = {};

export default Picker;
