import React, {PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectRover, fetchRoverDataIfNeeded, invalidateRover} from '../../actions'
// import Picker from '../components/Picker'
// import Posts from '../components/Posts'

class AsyncApp extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }

    componentDidMount() {
        const { dispatch, selectRover } = this.props
        dispatch(fetchRoverDataIfNeeded(selectedRover))
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedRover !== prevProps.selectedRover) {
            const { dispatch, selectRover } = this.props
            dispatch(fetchRoverDataIfNeeded(selectedRover))
        }
    }

    handleChange(differentRover) {
        this.props.dispatch(selectRover(differentRover))
        this.props.dispatch(fetchRoverDataIfNeeded(differentRovereddit))
    }

    handleRefreshClick(e) {
        e.preventDefault()

        const { dispatch, selectedRover} = this.props
        dispatch(invalidateRover(selectedRover))
        dispatch(fetchRoverDataIfNeeded(selectedRover))
    }

    render() {
        const { selectedRover, roversData, isFetching, lastUpdated } = this.props
        return (
            <div>

            </div>
        )
    }
}

AsyncApp.propTypes = {
    selectedRover: PropTypes.string.isRequired,
    roversData: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    const { selectedRover, getDataByRover } = state
    const {
              isFetching,
              lastUpdated,
              items: roversData
          } = getDataByRover[selectedRover] || {
        isFetching: true,
        items: []
    }

    return {
        selectedRover,
        roversData,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(AsyncApp)