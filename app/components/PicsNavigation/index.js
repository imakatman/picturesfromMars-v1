/**
 *
 * PicsNavigation
 *
 */

import React from 'react';
import styled from 'styled-components';
import {Flex, Box} from 'grid-styled';

const pathToCuriosityCameraImages = require.context('assets/cameras/Curiosity');
const curiosityCameras            = ['FHAZ.jpg', 'NAVCAM.jpg', 'MAST.jpg'];

const Wrapper = styled.div`
    position: absolute;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
`;

const H4 = styled.h4`

`;

const CameraImage = styled.div`
      background-position: 50%;
    background-size: cover;
    height: 250px;
        border-radius: 5px;
`;

class PicsNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            readyToRenderImages: false,
            noOfCameras: "",
            latestEarthDate: "",
            curiosityCameras: ['FHAZ.jpg', 'NAVCAM.jpg', 'MAST.jpg'],
            cameraImages: [],
        }

        this.dynamicImport           = this.dynamicImport.bind(this);
        this.selectAppropriateImages = this.selectAppropriateImages.bind(this);
    }

    dynamicImport(path) {
        return import(`assets/cameras/Curiosity/${path}`);
    }

    selectAppropriateImages(rover) {
        this.state.curiosityCameras.map(imgPath =>
            this.dynamicImport(imgPath).then(path => {
                const imageArray = this.state.cameraImages.concat(path);
                this.setState({cameraImages: imageArray});
            }).catch(error => console.log(error))
        );
    }

    componentWillMount() {
        console.log(this.props);
        this.setState({
            rover: this.props.selectedRover,
            noOfCameras: this.props.cameras.length,
            latestEarthDate: this.props.latestEarthDate,
        });
        this.selectAppropriateImages(this.state.rover);
    }

    render() {
        const widthOfWrapper = {width: 25 * this.state.noOfCameras + "%"};

        return (
            <Wrapper style={widthOfWrapper}>
                <H4>{this.state.latestEarthDate}</H4>
                <Flex>
                    {this.props.cameras.map((camera, i) =>
                        <Box flex='1' m="16px" key={i}>
                            <CameraImage
                                style={{backgroundImage: "url(" + this.state.cameraImages[i] + ")"}}
                                data-camera={camera.name}
                                onClick={() => this.props.fetchPictures(i)}>
                                {camera.full_name}
                            </CameraImage>
                        </Box>
                    )}
                </Flex>
            </Wrapper>
        );
    }
}

PicsNavigation.propTypes = {};

export default PicsNavigation;
