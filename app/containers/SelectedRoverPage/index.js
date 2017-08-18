/*
 *
 * SelectedRoverPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Flex, Box } from 'grid-styled';

import Gallery from 'components/Gallery';
import RoverDiagram from 'components/RoverDiagram';
import CameraNavigation from 'components/CameraNavigation';

import {
  selectRover,
  fetchRoverDataIfNeeded,
  fetchRoverImagesIfNeeded,
  fetchRoverImagesIfNeededOnce,
  fetchNextRoverImages,
  fetchNextPhotoSet,
} from './actions';

import { selectedACamera, unselectedCamera } from '../../actions';

const IntroLayer = styled(Flex)`
    background-color: #000;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;    
`;

const ActiveCameraLayer = styled(IntroLayer)`
    z-index: 1;    
`;

const NavigationBox = styled(Box)`
    flex: 1;
    position: relative;
`;

const GalleryContain = styled(Box)`
    overflow-y: scroll;
`;

const RoverName = styled.h1`
    color: #fff;
    position:absolute;
`;

const SearchForm = styled.form`
    position: absolute;
    bottom: 40px;
`;

const Label = styled.label`
    color: #fff;
`;

class SelectedRoverPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRover: this.props.routeParams.rover,
      value: '',
      firstPage: 1,
    };

    this.mountGallery             = this.mountGallery.bind(this);
    this.unmountGallery           = this.unmountGallery.bind(this);
    this.returnToPreviousDate     = this.returnToPreviousDate.bind(this);
    this.fetchNextAvailablePhotos = this.fetchNextAvailablePhotos.bind(this);
    this.datePicker               = this.datePicker.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(selectRover(this.state.selectedRover));

    return dispatch(fetchRoverDataIfNeeded(this.state.selectedRover));
  }

  componentDidMount() {
    const { selectedCamera } = this.props;

    if (selectedCamera.selected === true) {
      return this.mountGallery(selectedCamera['rover'], selectedCamera['cameraIndex'], selectedCamera['camera'], selectedCamera['sol']);
    }
  }

  mountGallery(rover, cameraIndex, camera, cameraFullName, currentSol) {
    const { dispatch, selectedRover, getDataByRover, isFetching } = this.props;

    if (!isFetching) {
      const mgfSelectedCamera = getDataByRover[selectedRover]['data']['cameras'][cameraIndex]['name'];

      if (typeof getDataByRover[selectedRover][mgfSelectedCamera] === 'undefined') {
        console.log('has not fetched images from this camera');

        const mgfRover          = rover || selectedRover;
        const mgfCamera         = camera || mgfSelectedCamera;
        const mgfCameraFullName = cameraFullName || getDataByRover[selectedRover].data.cameras[cameraIndex].full_name;
        const mgfSol            = currentSol || getDataByRover[selectedRover]['data']['max_sol'];

        return dispatch(fetchRoverImagesIfNeeded(...[mgfRover, mgfSol, 1, mgfCamera, mgfCameraFullName, cameraIndex,]));
      } else if (!isFetching && getDataByRover[selectedRover][mgfSelectedCamera]['hasFetchedImages'] === true) {
        console.log('has fetched images from this camera');

        const mgfRover          = rover || selectedRover;
        const mgfCamera         = camera || mgfSelectedCamera;
        const mgfCameraFullName = cameraFullName || getDataByRover[selectedRover].data.cameras[cameraIndex].full_name;
        const mgfSol            = currentSol || getDataByRover[selectedRover][mgfSelectedCamera]['latestMeaningfulSol'];
        const mgfEarthDate      = getDataByRover[selectedRover][mgfSelectedCamera][mgfSol]['earthDate'];

        return dispatch(fetchRoverImagesIfNeeded(mgfRover, mgfSol, 1, mgfCamera, mgfCameraFullName, cameraIndex, mgfEarthDate));
      }
    }
  }

  unmountGallery() {
    const { dispatch } = this.props;

    dispatch(unselectedCamera());

    return this.setState({
      galleryMounted: false,
    });
  }

  returnToPreviousDate() {
    const { dispatch, selectedRover, getDataByRover, selectedCamera } = this.props;

    const meaningfulSols = getDataByRover[selectedRover][selectedCamera['camera']]['meaningfulSols'];
    const i              = meaningfulSols.indexOf(selectedCamera['sol']);

    return dispatch(selectedACamera(selectedRover, selectedCamera['cameraIndex'], selectedCamera['camera'], selectedCamera['cameraFullName'], meaningfulSols[i - 1], selectedCamera['earthDate']));
  }

  fetchNextAvailablePhotos() {
    const { dispatch, selectedRover, selectedCamera } = this.props;

    return dispatch(fetchNextRoverImages(selectedRover, selectedCamera['sol'] - 1, 1, selectedCamera['camera'], selectedCamera['cameraFullName'], selectedCamera['cameraIndex']));
  }

  fetchNextPhotoSet() {
    const { dispatch, selectedRover, selectedCamera } = this.props;

    return dispatch(fetchNextPhotoSet(selectedRover, selectedCamera['sol'], selectedCamera['camera'], selectedCamera['cameraFullName'], selectedCamera['cameraIndex']));
  }

  datePicker() {
    const { dispatch, selectedRover, selectedCamera } = this.props;

    return dispatch(fetchRoverImagesIfNeededOnce(selectedRover, this.state.value, 1, selectedCamera['camera'], selectedCamera['cameraFullName'], selectedCamera['cameraIndex']));
  }

  render() {
    const { selectedRover, getDataByRover, selectedCamera } = this.props;

    return (
      <div>
        <Helmet
          title="Pictures From Mars"
          meta={[
            { name: 'description', content: 'Description of SelectedRoverPage' },
          ]}
        />

        {selectedRover && <RoverName>{selectedRover}</RoverName>}

        { typeof getDataByRover[selectedRover] !== 'undefined'
        && Object.keys(getDataByRover[selectedRover]['data']).length !== 0
        && getDataByRover[selectedRover]['isFetching'] === false
        && selectedCamera['selected'] === false ? (
            <IntroLayer>
              <RoverDiagram
                cameras={getDataByRover[selectedRover]['data']['cameras']}
                mountGallery={(i) =>
                  this.mountGallery(...[, i, , ,])}
                landing
              />
            </IntroLayer>
          ) : (
            <IntroLayer>
              <p>Loading...</p>
            </IntroLayer>
          )
        }

        {selectedCamera['selected'] === true &&
        <ActiveCameraLayer>
          <Flex direction="column" flex={1}>
            <NavigationBox>
              <CameraNavigation
                rover={selectedRover}
                cameras={getDataByRover[selectedRover]['data']['cameras']}
                mountGallery={(i) =>
                  this.mountGallery(...[, i, , ,])}
              />
            </NavigationBox>
            <NavigationBox>
              <RoverDiagram
                cameras={getDataByRover[selectedRover]['data']['cameras']}
                mountGallery={(i) => this.mountGallery(...[, i, , ,])}
                unmountGallery={() => this.unmountGallery()}
                landing={false}
              />
              <SearchForm onSubmit={this.datePicker}>
                <Label htmlFor="sol">
                  Sol:
                  <input
                    type="text"
                    value={this.state.value}
                    onChange={(e) => this.setState({ value: e.target.value })} />
                </Label>
                <input
                  type="submit"
                  value="Submit" />
              </SearchForm>
            </NavigationBox>
          </Flex>
          <GalleryContain flex={2}>
            <Gallery
              fetchingImagesState={getDataByRover[selectedRover][selectedCamera['camera']]['isFetching']}
              cameraFullName={selectedCamera['cameraFullName']}
              sol={selectedCamera['sol']}
              earthDate={selectedCamera['earthDate']}
              photos={getDataByRover[selectedRover][selectedCamera['camera']][selectedCamera['sol']]['photoData']}
              returnToPreviousDate={() => this.returnToPreviousDate()}
              fetchNextAvailablePhotos={() => this.fetchNextAvailablePhotos()}
              fetchNextSet={() => this.fetchNextPhotoSet()} />
          </GalleryContain>
        </ActiveCameraLayer>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectedRover, getDataByRover, selectedCamera } = state;

  return {
    selectedRover,
    getDataByRover,
    selectedCamera,
  };
}

SelectedRoverPage.propTypes = {
  routeParams: PropTypes.objectOf(PropTypes.string).isRequired,
  selectedRover: PropTypes.string.isRequired,
  getDataByRover: PropTypes.objectOf(PropTypes.shape({
      didInvalidate: PropTypes.bool,
      isFetching: PropTypes.bool,
      lastUpdated: PropTypes.number,
      name: PropTypes.string,
      data: PropTypes.shape({
        cameras: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
        id: PropTypes.number,
        landing_date: PropTypes.string,
        launch_date: PropTypes.string,
        max_date: PropTypes.string,
        max_sol: PropTypes.number,
        name: PropTypes.string,
        status: PropTypes.string,
        total_photos: PropTypes.number,
      }),
    })
  ).isRequired,
  selectedCamera: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(SelectedRoverPage);
