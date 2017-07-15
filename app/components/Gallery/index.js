/**
 *
 * Gallery
 *
 */

import React from 'react';
import styled from 'styled-components';
import {Flex, Box} from 'grid-styled';
import {Overlay} from '../StyledComponents/Overlay';

const GalleryContainer = styled.div`
    position:fixed;
    width:100%;
    height: 100%;
    top:0;
    left:0;
    z-index: 3;
`;

const Img = styled.img`
    width: 100%;
`;

class Gallery extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <GalleryContainer>
                {this.props.camera}
                <Flex>
                    {this.props.photos.map(photo =>
                        <Box flex='1' m="20px">
                            <Img src={photo.img_src} alt={photo.roverName + ":" + photo.camera + "-" + photo.id}
                                key={photo.id} />
                        </Box>
                    )}

                </Flex>
                <Overlay/>
            </GalleryContainer>
        );
    }
}

Gallery.propTypes = {};

export default Gallery;
