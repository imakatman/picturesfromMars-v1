import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { fetchAllRoverDataIfNeeded, invalidateAllRovers, selectRover, fetchRoverDataIfNeeded, invalidateRover } from '../../actions'
import Picker from 'components/Picker'
import InsideRoverContainer from 'components/InsideRoverContainer'


class AsyncApp extends React.Component {
    constructor(props) {
        super(props);

        this.state ={
            roversNames: []
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { dispatch, getAllRoversData } = this.props;

        dispatch(fetchAllRoverDataIfNeeded());

        const roversNames = getAllRoversData.AllRovers.simpleDataAboutAllRovers.map(rover=>
            rover.name
        );

        this.setState({
            roversNames: roversNames
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedRover !== prevProps.selectedRover) {
            const { dispatch, selectedRover} = this.props
            dispatch(fetchRoverDataIfNeeded(selectedRover))
        }
    }

    handleChange(selectedRover){

    }


    render() {
        const { selectedRover, getDataByRover, getAllRoversData } = this.props;

        return (
            <div>
                <Picker onChange={this.handleChange}
                        values={"roversNames"}/>
            </div>
        )
    }
}

function mapStateToProps(state) {

    const { selectedRover, getDataByRover, getAllRoversData } = state;

    const {
              isFetching,
              lastUpdated,
              data: roverData
          } = getDataByRover[selectedRover] || {
        isFetching: true,
        data: []
    }

    const {
              isFetchingAll,
              lastUpdatedAll,
              simpleDataAboutAllRovers: allRoversData
          } = getAllRoversData[selectedRover] || {
        isFetching: true,
        simpleDataAboutAllRovers: []
    }

    return {
        selectedRover,
        getDataByRover,
        getAllRoversData
    };
}

export default connect(mapStateToProps)(AsyncApp);