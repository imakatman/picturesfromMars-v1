/**
 *
 * InsideRoverContainer
 *
 */

import React, {PropTypes} from 'react'
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import test from 'assets/test.jpg'
import CuriosityPanorama from 'assets/panorama/curiosity_false_colors.jpg';
import OpportunityPanorama from 'assets/panorama/opportunity.jpg';

class InsideRoverContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            name: "",
            texture: {},
            lon: 90,
            lat: 0,
            phi: 0,
            theta: 0,
            cameraPosition: new THREE.Vector3(0, 0, 0),
            cameraLookAt: new THREE.Vector3(0, 0, 0),
        }

        this.chooseAppropriatePanorama= this.chooseAppropriatePanorama.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.onDocumentMouseUp   = this.onDocumentMouseUp.bind(this);
        this.onAnimate = this.onAnimate.bind(this);
    }

    componentDidMount() {
        this.chooseAppropriatePanorama(this.props.name);

        this.setState({
            name: this.props.name
        });

        document.querySelector("canvas").addEventListener("mousedown", this.onDocumentMouseDown, false);
    }

    chooseAppropriatePanorama(rover){
        switch(rover){
            case "Curiosity":
                const Panorama = {CuriosityPanorama};
                const key = Object.keys({CuriosityPanorama})[0];
                this.setState({
                    texture: Panorama[key]
                })
                break;
            case "Opportunity":
                const Panorama = {OpportunityPanorama};
                const key = Object.keys({OpportunityPanorama})[0];
                this.setState({
                    texture: Panorama[key]
                })
                break;
            default:
                return;
        }
    }

    onDocumentMouseDown(event) {
        event.preventDefault();
        document.querySelector("canvas").addEventListener('mousemove', this.onDocumentMouseMove, false);
        document.querySelector("canvas").addEventListener('mouseup', this.onDocumentMouseUp, false);
    }

    onDocumentMouseMove(event) {
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.setState(function(prevState){
            return{
                lon: prevState.lon - movementX * 0.1,
                lat: prevState.lat + movementY * 0.1
            }
        });
    }

    onDocumentMouseUp(event) {
        document.querySelector("canvas").removeEventListener('mousemove', this.onDocumentMouseMove);
        document.querySelector("canvas").removeEventListener('mouseup', this.onDocumentMouseUp);
    }

    onAnimate() {
        const x = Math.sin(this.state.phi) * Math.cos((this.state.theta), 0, 0);
        const y = Math.cos(this.state.phi);
        const z = Math.sin(this.state.phi) * Math.sin(this.state.theta);
        // const cameraPosition = new THREE.Vector(x, y, z);

        this.setState(function(prevState){
            return{
                // lon: prevState.lon + 0.1,
                lat: Math.max(-85, Math.min(85, prevState.lat)),
                phi: THREE.Math.degToRad(90 - this.state.lat),
                theta: THREE.Math.degToRad(this.state.lon),
                cameraLookAt: new THREE.Vector3(
                    (Math.sin(this.state.phi) * Math.cos((this.state.theta), 0, 0)),
                    (Math.cos(this.state.phi)),
                    (Math.sin(this.state.phi) * Math.sin(this.state.theta))
                )
            }
        });
    }

    render() {
        const width  = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height

        return (
            <React3 mainCamera="camera" width={width} height={height} ref={(three) => this.threeObj = three} onAnimate={this.onAnimate}>
                <scene>
                    <perspectiveCamera
                        name="camera"
                        fov={75}
                        aspect={width / height}
                        near={0.1}
                        far={10000}
                        position={this.state.cameraPosition}
                        lookAt={this.state.cameraLookAt}
                    />
                    <object3D scale={new THREE.Vector3(-1, 1, 1)}>
                        <mesh>
                            <sphereGeometry
                                radius={500}
                                widthSegments={60}
                                heightSegments={40}
                            />
                            <meshBasicMaterial>
                                <texture url={this.state.texture} anisotropy={10} ref={(texture) => this.texture = texture}/>
                            </meshBasicMaterial>
                        </mesh>
                    </object3D>
                </scene>
            </React3>
        );
    }
}

InsideRoverContainer.propTypes = {};

// ReactDOM.render(<InsideRoverContainer/>, document.body);
export default InsideRoverContainer;
