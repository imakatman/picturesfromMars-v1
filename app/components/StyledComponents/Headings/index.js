import styled from 'styled-components';

export const Heading = styled.h1`
    font-size: 40px;
    letter-spacing: 5px;
    color: ${props => props.color};
`;

export const SubHeading = styled.h3`
    font-size: 28px;
    letter-spacing: 3px;
    color: ${props => props.color};
`;