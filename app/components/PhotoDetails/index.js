/**
 *
 * PhotoDetails
 *
 */

import React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import FaTimes from 'react-icons/lib/fa/times-circle';
import FaAngleLeft from 'react-icons/lib/fa/angle-left';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

import { Button } from 'components/StyledComponents/Button';
import { Heading, SubHeading } from 'components/StyledComponents/Headings';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #000;
`;

const Close = styled(FaTimes)`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 2em;
`;

const Next = styled.div`
  font-size: 2em;
  position:absolute;
  top: 50%;
  font-size: 3em;
  right: 20px;
`;

const Prev = styled(Next)`
  right: auto;
  left: 20px;
`;

// const AlignSelfEnd = styled(Box)`
//   align-self: flex-end;
// `;
//
// const AlignSelfCenter = styled(Box)`
//   align-self: center;
// `;

const Photo = styled.img`
  max-width: 700px;
  width: 80%;
`;

class PhotoDetails extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  render() {
    const id             = this.props.details['id'];
    const src            = this.props.details['src'];
    const rover          = this.props.details['rover'];
    const camera         = this.props.details['camera'];
    const cameraFullName = this.props.details['cameraFullName'];
    const sol            = this.props.details['sol'];
    const earthDate      = this.props.details['earthDate'];

    return (
      <Container>
        <Button>
          <Close onClick={() => this.props.exitPhotoDetails()} />
        </Button>
        <Flex align="center" style={{ height: '100%', width: '90%', margin: 'auto' }}>
          <Box flex='1' p='20px' style={{textAlign: 'center'}}>
            <Prev>
              <Button onClick={() => this.props.viewPrevPhoto()}>
                <FaAngleLeft />
              </Button>
            </Prev>
            <Photo
              src={src}
              alt={rover + ' ' + camera + ' ' + sol + ' ' + id} />
          </Box>
          <Box flex="1">
            <Heading>#{id}</Heading>
            <h2>taken on sol {sol} earth date {earthDate}</h2>
            <SubHeading>{rover}</SubHeading>
            <SubHeading>{cameraFullName} -- {camera}</SubHeading>
            <Next>
              <Button onClick={() => this.props.viewNextPhoto()}>
                <FaAngleRight />
              </Button>
            </Next>
          </Box>
        </Flex>
      </Container>
    );
  }
}

PhotoDetails.propTypes = {};

export default PhotoDetails;
