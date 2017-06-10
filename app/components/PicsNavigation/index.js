/**
*
* PicsNavigation
*
*/

import React from 'react';
// import styled from 'styled-components';


function PicsNavigation(props) {
  console.log(props.cameras);
  return (
    <div>
        {props.cameras.map((camera) =>
            <a href={"#" + camera.name}>{camera.full_name}</a>
        )}
    </div>
  );
}

PicsNavigation.propTypes = {

};

export default PicsNavigation;
