/**
 *
 * Gallery
 *
 */

import React from 'react';
import styled from 'styled-components';
import {Flex, Box} from 'grid-styled';
import FaTimesCircle from 'react-icons/lib/fa/times-circle/';
import {Overlay} from '../StyledComponents/Overlay';

const GalleryContainer = styled.div`
    position:fixed;
    width:100%;
    height: 100%;
    top:0;
    left:0;
    z-index: 3;
`;

const Close = styled.div`
    position: absolute;
    top: 1%;
    right: 1%;
    color: #fff;
    font-size: 36px;
    z-index: 4;
`

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
                <Close onClick={() => this.props.unmountGallery()}>
                    <FaTimesCircle/>
                </Close>
                <Flex>
                    {this.props.photos.map(photo =>
                        <Box flex='1' m="20px" key={photo.id}>
                            <Img src={photo.img_src} alt={photo.roverName + ":" + photo.camera + "-" + photo.id} />
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
