/**
 *
 * PicsNavigation
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex } from 'grid-styled';

const CameraNavList = styled.ul`
    padding: 0;
`;

const CameraNavItem = styled.li`
    list-style:none;
    padding: 4%;
    text-align: left;
    color: #fff;
    background-size: cover;
    background-position: 50%;
    position:relative;
    z-index: 1;
    cursor: pointer;
    font-family: 'Roboto Mono', monospace;
    &:after{
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0));
    }
    &:hover{
      &:after{
        background: linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0));
    }
`;

class CameraNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraImages: [],
    }
  }

  componentWillMount() {
    this.setState({
      cameras: this.props.cameras.map(camera => camera.name),
    });
  }

  componentDidMount() {
    this.state.cameras.map(imgPath =>
      System.import(`assets/cameras/${this.props.rover}/${imgPath}.jpg`).then(path => {
        const imageArray = this.state.cameraImages.concat(path);
        return this.setState({ cameraImages: imageArray });
      }).catch(error => console.log(error)));
  }

  render() {
    return (
      <Flex direction={'column'}>
        <CameraNavList>
          {this.props.cameras.map((camera, i) =>
            <CameraNavItem
              key={i}
              style={{ backgroundImage: 'url(' + this.state.cameraImages[i] + ')' }}
              data-camera={camera.name}
              onClick={() => this.props.mountGallery(i)}>
              {camera.full_name}
            </CameraNavItem>
          )}
        </CameraNavList>
      </Flex>
    );
  }
}

CameraNavigation.propTypes = {
  rover: PropTypes.string.isRequired,
  cameras: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  mountGallery: PropTypes.func.isRequired,
};

export default CameraNavigation;
