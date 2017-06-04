/**
 *
 * InsideRoverContainer
 *
 */

import React, {PropTypes} from 'react'
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import OpportunityPanorama from 'assets/panorama/opportunity.jpg';

class InsideRoverContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.cameraPosition = new THREE.Vector3(0, 0, 5);

        this.state = {
            name: "",
        }
    }

    componentDidMount() {
        this.setState({
            name: this.props.name
        })
    }

    render() {
        const width  = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height

        console.log();

        return (
            <React3 mainCamera="camera" width={width} height={height}>
                <scene>
                    <perspectiveCamera
                        name="camera"
                        fov={75}
                        aspect={width / height}
                        near={0.1}
                        far={10000}
                        position={this.cameraPosition}
                    />
                    <object3D scale={new THREE.Vector3(-1, 1, 1)}>
                        <mesh>
                            <sphereGeometry
                                radius={5000}
                            />
                            <meshBasicMaterial>
                                <texture url={OpportunityPanorama} />
                            </meshBasicMaterial>
                        </mesh>
                    </object3D>
                </scene>
            </React3>
        );
    }
}

InsideRoverContainer.propTypes = {};

export default InsideRoverContainer;
