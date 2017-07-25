/**
 *
 * Gallery
 *
 */

import React from 'react';
import styled from 'styled-components';
import {Flex, Box} from 'grid-styled';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import {Overlay, TopLayer} from '../StyledComponents/Overlay';

const GalleryContainer = styled.div`
    position:relative;
    z-index: 3;
    height: 100%;
`;

const Next = styled.div`
    position: absolute;
    top: 0;
    right: 1%;
    color: #fff;
    font-size: 20px;
`

const Back = styled.div`
    position: absolute;
    bottom: 1%;
    left: 1%;
    color: #fff;
    font-size: 36px;
`;

const CameraName = styled.h2`
    color: #fff;
`

const Img = styled.img`
    width: 100%;
`;

class Gallery extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
    }

    render() {
        console.log('GALLERY!');
        return (
            <GalleryContainer>
                <CameraName>
                    {this.props.cameraFullName} {this.props.cameraAbbrev}
                </CameraName>
                <Next onClick={(i) => this.props.grabNextAvailablePhotos(i)}>
                    <p>Next Available Date with Photos</p>
                </Next>
                <Back onClick={() => this.props.unmountGallery()}>
                    <FaLongArrowLeft />
                </Back>
                <Flex wrap={true}>
                    {this.props.photos.map(photo =>
                        <Box w={1 / 4} m="20px" key={photo.id}>
                            <Img src={photo.img_src} alt={photo.roverName + ":" + photo.camera + "-" + photo.id} />
                        </Box>
                    )}
                </Flex>
            </GalleryContainer>
        );
    }
}

Gallery.propTypes = {};

export default Gallery;
