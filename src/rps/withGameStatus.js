import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'

import LoadingScreen from '../layout/LoadingScreen'
import ErrorScreen from '../layout/ErrorScreen'
import withAsyncData from '../utils/withAsyncData'
import { actions } from './rpsActions'
import { gameParameters } from './rpsApi'

/**
 * Provides refreshGameStatus(), gameInfo and gameStatus props
 */
export default function withGameStatus(WrappedComponent) {
  class WithGameStatus extends React.Component {
    constructor(props) {
      super(props)
      this.refreshGameStatus = this.refreshGameStatus.bind(this)
    }

    componentDidMount() {
      this.refreshGameStatus()
    }

    getGameName() {
      return this.props.navigation.state.params.gameName
    }

    refreshGameStatus() {
      const gameName = this.getGameName()
      this.props.gameInfo.load(gameName)
      this.props.actions.getGameStatus(gameName)
    }

    render() {
      const { gameStatus, gameInfo } = this.props

      if (gameStatus.error || gameInfo.error) {
        return <ErrorScreen>{gameStatus.error || gameInfo.error}</ErrorScreen>
      }

      if (gameStatus.fetching || gameInfo.pending || gameStatus.payload === null) {
        return <LoadingScreen />
      }

      const newProps = {
        ...this.props,
        refreshGameStatus: this.refreshGameStatus,
        gameInfo: gameInfo.data,
        gameStatus: gameStatus.payload
      }
      return <WrappedComponent {...newProps} />
    }
  }

  const mapStateToProps = state => ({
    gameStatus: state.rps.gameStatus
  })

  const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })

  WithGameStatus.displayName = `WithGameStatus(${getDisplayName(WrappedComponent)})`

  return compose(
    withNavigation,
    withAsyncData('gameInfo', gameParameters.get),
    connect(mapStateToProps, mapDispatchToProps)
  )(WithGameStatus)
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
