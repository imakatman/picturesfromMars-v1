import styled from 'styled-components';

export const Overlay = styled.div`
    width: 100%;
    height: 100%;
    position:absolute;
    top: 0;
    left: 0;
    z-index: 0;
    background-color: ${ props => 'rgba(0,0,0,' + props.opacity + ')' };
`;

export const TopLayer = styled.div`
    position: relative;
    z-index: 1;
`;
