/**
 *
 * Picker
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router';
import { Flex, Box } from 'grid-styled';

import Curiosity from 'assets/rovers/Curiosity.jpg';
import Opportunity from 'assets/rovers/Opportunity.jpg';
import Spirit from 'assets/rovers/Spirit.jpg';

import { TopLayer, Overlay } from '../StyledComponents/Overlay';
import { Heading, SubHeading } from '../StyledComponents/Headings';
import { SmallLabel } from '../StyledComponents/SmallLabel';


const HeadingLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
`;

const RoverColumn = styled.div`
    position: relative;
    background-size: cover;
    background-position: ${props => props.name === 'Curiosity' ? '40%' : '50%'};
    height: 100vh;
    display: table-cell;
    vertical-align: middle;
    width: 100vw;
    text-align: center;
`;

class Picker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      portrait: [{ Curiosity }, { Opportunity }, { Spirit }],
    }
  }

  render() {
    return (
      <Flex>
        {this.props.values.map((value, i) =>
          <Box flex={1} key={value.id}>
            <div>
              <HeadingLink to={'/r/' + value.name}>
                <RoverColumn
                  active={this.props.activeState[i]}
                  name={value.name}
                  style={{ backgroundImage: 'url(' + this.state.portrait[i][value.name] + ')' }}>
                  <TopLayer>
                    <Heading color={'white'}>
                      {value.name}
                    </Heading>
                    <SubHeading color={'white'}>
                      <SmallLabel>Total Photos</SmallLabel>
                      {value.total_photos}
                    </SubHeading>
                    <SubHeading color={'white'}>
                      <SmallLabel>Total Photos</SmallLabel>
                    </SubHeading>
                  </TopLayer>
                  <Overlay opacity='0.3' />
                </RoverColumn>
              </HeadingLink>
            </div>
          </Box>
        )}
      </Flex>
    );
  }
}

Picker.propTypes = {
  values: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    total_photos: PropTypes.number,
  })).isRequired,
  activeState: PropTypes.arrayOf(PropTypes.bool).isRequired,
};

export default Picker;
