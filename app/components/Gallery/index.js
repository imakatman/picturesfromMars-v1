/**
 *
 * Gallery
 *
 */

import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import Masonry from 'react-masonry-component';

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
`;

const Date = styled.h3`
    
`;

const LoadMore = styled.p`
  text-align:right;
`;

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
    return (
      <GalleryContainer>
        <h1>
          {this.props.cameraFullName} {this.props.cameraAbbrev}
        </h1>
        {this.props.fetchingImagesState ? (
            <p>Loading... looking for the latest sol in which this camera took photos</p>
          ) : (
            <div>
              <Date>
                Sol: {this.props.sol} || {this.props.earthDate}
              </Date>
              <Next>
                <span onClick={() => this.props.returnToPreviousDate()}>Previous Date</span>
                <span onClick={(i) => this.props.fetchNextAvailablePhotos(i)}>Next Available Date with Photos</span>
              </Next>
              <Flex wrap={true}>
                <Masonry style={{ width: '100%' }}>
                  {this.props.photos ? (
                      this.props.photos.map(photo =>
                        <Box
                          w={1 / 4}
                          m='10px 0'
                          p='0 15px'
                          key={photo.id}>
                          <Img
                            src={photo.img_src}
                            alt={photo.roverName + ':' + photo.camera + '-' + photo.id} />
                        </Box>)
                    ) : (
                      <p style={{ color: '#fff' }}>
                        No Photos Available
                      </p>
                    )
                  }
                </Masonry>
              </Flex>
              <LoadMore onClick={(i) => this.props.fetchNextSet(i)}>
                Load more photos
              </LoadMore>
            </div>
          )}
      </GalleryContainer>
    );
  }
}

Gallery.propTypes = {};

export default Gallery;
