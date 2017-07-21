/**
*
* RoverDiagram
*
*/

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: rgba(0,0,0,0.9);
`;


class RoverDiagram extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    console.log("ROverDiagram")
    return (
      <Container>

      </Container>
    );
  }
}

RoverDiagram.propTypes = {

};

export default RoverDiagram;
