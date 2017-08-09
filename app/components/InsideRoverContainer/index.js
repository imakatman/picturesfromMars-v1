/**
 *
 * InsideRoverContainer
 *
 */

import React from 'react'
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import CuriosityPanorama from 'assets/panorama/curiosity_false_colors.jpg';
import OpportunityPanorama from 'assets/panorama/opportunity.jpg';

class InsideRoverContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            texture: {},
            lon: 90,
            lat: 0,
            phi: 0,
            theta: 0,
            cameraPosition: new THREE.Vector3(0, 0, 0),
            cameraLookAt: new THREE.Vector3(0, 0, 0),
            cameraImages: [],
        }

        this.dynamicImport= this.dynamicImport.bind(this);
        this.chooseAppropriatePanorama= this.chooseAppropriatePanorama.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.onDocumentMouseUp   = this.onDocumentMouseUp.bind(this);
        this.onAnimate = this.onAnimate.bind(this);
    }

    componentWillMount(){
        // this.chooseAppropriatePanorama(this.props.name);
    }

    componentDidMount() {
        document.querySelector("canvas").addEventListener("mousedown", this.onDocumentMouseDown, false);

        const imgFiles = [
            "opp_b_1_1.jpg",
            "opp_b_1_2.jpg",
            "opp_b_2_1.jpg",
            "opp_b_2_2.jpg",
            "opp_d_1_1.jpg",
            "opp_d_1_2.jpg",
            "opp_d_2_1.jpg",
            "opp_d_2_2.jpg",
            "opp_f_1_1.jpg",
            "opp_f_1_2.jpg",
            "opp_f_2_1.jpg",
            "opp_f_2_2.jpg",
            "opp_l_1_1.jpg",
            "opp_l_1_2.jpg",
            "opp_l_2_1.jpg",
            "opp_l_2_2.jpg",
            "opp_r_1_1.jpg",
            "opp_r_1_2.jpg",
            "opp_r_2_1.jpg",
            "opp_r_2_2.jpg",
            "opp_u_1_1.jpg",
            "opp_u_1_2.jpg",
            "opp_u_2_1.jpg",
            "opp_u_2_2.jpg",
        ]

        imgFiles.map(file => {
            this.dynamicImport(file).then(path => {
                const imageArray = this.state.cameraImages.concat(path);
                this.setState({cameraImages: imageArray});
            }).catch(error => console.log(error))
        });
    }

    dynamicImport(path) {
        return import(`assets/panorama/Opportunity/${path}`);
    }

    chooseAppropriatePanorama(rover){
        switch(rover){
            case "Curiosity":
                var Panorama = {CuriosityPanorama};
                var key = Object.keys({CuriosityPanorama})[0];
                this.setState({
                    texture: Panorama[key]
                })
                break;
            case "Opportunity":
                var Panorama = {OpportunityPanorama};
                var key = Object.keys({OpportunityPanorama})[0];
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
        console.log(this.box);
        return (
            <React3 mainCamera="camera" width={window.innerWidth} height={window.innerHeight} ref={(three) => this.threeObj = three} onAnimate={this.onAnimate}>
                <scene>
                    <perspectiveCamera
                        name="camera"
                        fov={75}
                        aspect={window.innerWidth / window.innerHeight}
                        near={0.1}
                        far={10000}
                        position={this.state.cameraPosition}
                        lookAt={this.state.cameraLookAt}
                    />
                    <object3D scale={new THREE.Vector3(-1, 1, 1)}>
                        <mesh>
                            <boxGeometry
                                width={300}
                                height={300}
                                depth={300}
                                widthSegments={24}
                                heightSegments={24}
                                depthSegments={24}
                                ref={(box) => this.box = box}
                            />
                            <meshBasicMaterial>
                                <texture url={OpportunityPanorama} anisotropy={10} />
                            </meshBasicMaterial>
                        </mesh>
                    </object3D>
                </scene>
            </React3>
        );
    }
}

InsideRoverContainer.propTypes = {
    name: PropTypes.string.isRequired
};

export default InsideRoverContainer;
