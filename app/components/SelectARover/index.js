/**
 *
 * RoverSimpleData
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Link} from 'react-router';
import {TopLayer, Overlay} from '../StyledComponents/Overlay';
import {Heading, SubHeading} from '../StyledComponents/Headings';
import {SmallLabel} from '../StyledComponents/SmallLabel';

const RoverColumn = styled.div`
    position: relative;
    background-size: cover;
    background-position: ${props => props.name === "Curiosity" ? "40%" : "50%"};
    height: 90vh;
    display:table-cell;
    vertical-align:middle;
    width:100vw;
    text-align:center;
`;

function SelectARover(props) {
    return (
        <Link to={"/r/" + props.name} style={{textDecoration: "none",cursor:"pointer"}}>
            <RoverColumn active={props.activeState} name={props.name}
                style={{backgroundImage: "url(" + props.portrait + ")"}}>
                <TopLayer>
                    <Heading color={"white"}>
                        {props.name}
                    </Heading>
                    <SubHeading color={"white"}>
                        <SmallLabel>Total Photos</SmallLabel>
                        {props.totalPhotos}
                    </SubHeading>
                </TopLayer>
                <Overlay opacity="0.3"/>
            </RoverColumn>
        </Link>
    );
}

SelectARover.propTypes = {
    activeState: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    portrait: PropTypes.string.isRequired,
    totalPhotos: PropTypes.number.isRequired,
};

export default SelectARover;
