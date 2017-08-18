/**
 *
 * Gallery
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
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
    color: #ececec;
    font-size: 20px;
    span{
      &:hover{
        color: #fff;
        cursor: pointer;
      }
    }
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
          {this.props.cameraFullName}
        </h1>
        {this.props.fetchingImagesState ? (
            <p>Loading... looking for the latest sol in which this camera took photos</p>
          ) : (
            <div>
              <h3>
                Sol: {this.props.sol} || {this.props.earthDate}
              </h3>
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

Gallery.propTypes = {
  cameraFullName: PropTypes.string.isRequired,
  fetchingImagesState: PropTypes.bool.isRequired,
  sol: PropTypes.number.isRequired,
  earthDate: PropTypes.string.isRequired,
  photos: PropTypes.arrayOf(PropTypes.shape({
    camera: PropTypes.object,
    earth_date: PropTypes.string,
    id: PropTypes.number,
    img_src: PropTypes.string,
    rover: PropTypes.object,
  })).isRequired,
  fetchNextSet: PropTypes.func.isRequired,
};

export default Gallery;
