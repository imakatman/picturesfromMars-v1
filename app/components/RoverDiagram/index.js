/**
 *
 * RoverDiagram
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router';
import { Button } from 'components/StyledComponents/Button';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';

const Container = styled.div`
  background-color: rgba(0,0,0,0.9);
  width: 100%;
  height: 90%;
`;

const CameraBtn = styled.a`
    color: #fff;
    cursor:pointer;
    &:hover{
        color: rgba(231, 125, 17, 0.77);
        transition: all 0.2s ease;
    }
`;

const Back = styled.div`
    position: absolute;
    bottom: 1%;
    left: 1%;
    font-size: 36px;
`;

const BackLink = styled(Link)`
    text-decoration: none;
    cursor:pointer;
`;

class RoverDiagram extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Container>
        {this.props.cameras.map((camera, i) =>
          <CameraBtn
            key={camera.full_name}
            data-camera={camera.name}
            onClick={() => this.props.mountGallery(i)}>
            {camera.full_name}
          </CameraBtn>
        )}
        {this.props.landing ? (
            <Back>
              <BackLink to={'/'}>
                <Button>
                  <FaLongArrowLeft />
                </Button>
              </BackLink>
            </Back> ) : (
            <Back onClick={() => this.props.unmountGallery()}>
              <Button>
                <FaLongArrowLeft />
              </Button>
            </Back>
          )}
      </Container>
    );
  }
}

RoverDiagram.propTypes = {
  cameras: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  mountGallery: PropTypes.func.isRequired,
  landing: PropTypes.bool.isRequired,
  unmountGallery: PropTypes.func,
};

export default RoverDiagram;
