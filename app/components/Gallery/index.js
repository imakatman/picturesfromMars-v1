/**
*
* Gallery
*
*/

import React from 'react';
// import styled from 'styled-components';


class Gallery extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
          {this.props.camera}
          {this.props.photos.map(photo=>
              <img src={photo.img_src} alt={photo.roverName + ":" + photo.camera + "-" + photo.id} key={photo.id}/>
          )}
      </div>
    );
  }
}

Gallery.propTypes = {

};

export default Gallery;
