import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import LoadingScreen from '../layout/LoadingScreen'
import ErrorScreen from '../layout/ErrorScreen'
import { actions } from './uportActions'

/**
 * Provides ...
 */
export default function withCredentials(WrappedComponent) {
  class WithCredentials extends React.Component {
    constructor(props) {
      super(props)
      this.loadCredentials = this.loadCredentials.bind(this)
    }

    componentDidMount() {
      if (!this.props.credentials.initialized) {
        this.loadCredentials()
      }
    }

    loadCredentials() {
      this.props.actions.loadCredentials()
    }

    render() {
      const { credentials } = this.props

      if (credentials.error) {
        return <ErrorScreen noFooter>{credentials.error}</ErrorScreen>
      }

      if (credentials.fetching) {
        return <LoadingScreen noFooter />
      }

      return (
        <WrappedComponent {...this.props} loadCredentials={this.loadCredentials} credentials={credentials.payload} />
      )
    }
  }

  const mapStateToProps = state => ({
    credentials: state.uport.credentials
  })

  const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })

  WithCredentials.displayName = `WithCredentials(${getDisplayName(WrappedComponent)})`

  return connect(mapStateToProps, mapDispatchToProps)(WithCredentials)
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
