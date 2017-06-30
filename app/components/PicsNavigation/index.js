/**
*
* PicsNavigation
*
*/

import React from 'react';
// import styled from 'styled-components';


function PicsNavigation(props) {
  console.log(props);
  return (
    <ul>
        {props.cameras.map((camera, i) =>
            <li data-camera={camera.name}
                key={i} onClick={()=>props.fetchPictures(i)}>
                  {camera.full_name}
              </li>
        )}
    </ul>
  );
}

PicsNavigation.propTypes = {

};

export default PicsNavigation;
