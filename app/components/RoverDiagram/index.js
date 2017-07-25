/**
 *
 * RoverDiagram
 *
 */

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: rgba(0,0,0,0.9);
  position:absolute;
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

class RoverDiagram extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        console.log('ROVER DIAGRAM!');
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
            </Container>
        );
    }
}

RoverDiagram.propTypes = {};

export default RoverDiagram;
