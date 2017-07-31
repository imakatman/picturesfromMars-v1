/**
 *
 * RoverDiagram
 *
 */

import React from 'react';
import styled from 'styled-components';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';

const Container = styled.div`
  background-color: rgba(0,0,0,0.9);
  width: 100%;
    height: 100%;
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
    color: #fff;
    font-size: 36px;
`;

class RoverDiagram extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        console.log('ROVER DIAGRAM!');
        console.log(this.props.landing);
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
                {!this.props.landing &&
                <Back onClick={() => this.props.unmountGallery()}>
                    <FaLongArrowLeft />
                </Back> }
            </Container>
        );
    }
}

RoverDiagram.propTypes = {};

export default RoverDiagram;
