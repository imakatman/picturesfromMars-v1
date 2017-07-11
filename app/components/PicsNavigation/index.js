/**
*
* PicsNavigation
*
*/

import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: absolute;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    width: 100%;
`

const H4 = styled.h4`

`

const Ul = styled.ul`
  padding: 0;
`;

const Li = styled.li`
  list-style:none;
`;


function PicsNavigation(props) {
  return (
      <Wrapper>
        <H4>{props.latestEarthDate}</H4>
        <Ul>
            {props.cameras.map((camera, i) =>
                <Li data-camera={camera.name}
                    key={i} onClick={()=>props.fetchPictures(i)}>
                    {camera.full_name}
                </Li>
            )}
        </Ul>
      </Wrapper>
  );
}

PicsNavigation.propTypes = {

};

export default PicsNavigation;
