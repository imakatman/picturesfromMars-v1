/**
 *
 * Gallery
 *
 */

import React from 'react';
import styled from 'styled-components';
import {Flex, Box} from 'grid-styled';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import Masonry from 'react-masonry-component';
import {Overlay, TopLayer} from '../StyledComponents/Overlay';

const GalleryContainer = styled.div`
    position:relative;
    z-index: 3;
    height: 100%;
    background: #000;
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

const Date = styled.h3`
    color: #fff;
`

const Img = styled.img`
    width: 100%;
    max-width: 100%;
    height: auto;
    display:block;
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
                <Date>
                    {this.props.sol} || {this.props.earthDay}
                </Date>
                <Next>
                    <span>Previous Date</span>
                    <span onClick={(i) => this.props.grabNextAvailablePhotos(i)}>Next Available Date with Photos</span>
                </Next>
                <Back onClick={() => this.props.unmountGallery()}>
                    <FaLongArrowLeft />
                </Back>
                <Flex wrap={true}>
                    <Masonry style={{width:"100%"}}>
                        {this.props.photos.map(photo =>
                            <Box w={1 / 4} m="10px 0" p="0 15px" key={photo.id}>
                                <Img src={photo.img_src} alt={photo.roverName + ":" + photo.camera + "-" + photo.id} key={photo.id}/>
                            </Box>
                        )}
                    </Masonry>
                </Flex>
            </GalleryContainer>
        );
    }
}

Gallery.propTypes = {};

export default Gallery;
