/**
 *
 * PicsNavigation
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Flex, Box} from 'grid-styled';

const Wrapper = styled.div`
    position: absolute;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
`;

const CameraNavItem = styled.li`
      list-style:none;
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
        import(`assets/cameras/${this.props.rover}/${imgPath}.jpg`).then(path => {
            const imageArray = this.state.cameraImages.concat(path);
            this.setState({cameraImages: imageArray});
        }).catch(error => console.log(error)));
    }

    render() {
        return (
            <Flex direction={"column"}>
                {this.props.cameras.map((camera, i) =>
                    <ul key={i}>
                        <CameraNavItem
                            style={{backgroundImage: "url(" + this.state.cameraImages[i] + ")"}}
                            data-camera={camera.name}
                            onClick={() => this.props.mountGallery(i)}>
                            {camera.full_name}
                        </CameraNavItem>
                    </ul>
                )}
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
