import React, { Component } from 'react'
import { Text } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button } from 'native-base'

import AppLayout from '../layout/AppLayout'
import LoadingScreen from '../layout/LoadingScreen'
import { actions } from '../uport/uportActions'

class UportConnect extends Component {
  componentWillReceiveProps(newProps) {
    if (newProps.credentials.payload && newProps.credentials.payload.name) {
      // this will trigger EnterGameName component refresh when we received credentials
      this.props.actions.loadCredentials()
    }
  }

  render() {
    const { credentials, actions } = this.props

    if (credentials.fetching) {
      return <LoadingScreen />
    }

    return (
      <AppLayout title="Connect with uPort" contentStyle={styles.content}>
        <Text style={styles.text}>Please install uPort app and press Connect button below</Text>
        <Button block primary onPress={actions.requestCredentials}>
          <Text style={styles.connectBtn}>Connect with uPort</Text>
        </Button>
        {credentials.error && <Text style={styles.error}>{credentials.error + ''}</Text>}
      </AppLayout>
    )
  }
}

const mapStateToProps = state => ({
  credentials: state.uport.credentials
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UportConnect)

const styles = {
  content: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  error: {
    fontSize: 20,
    marginBottom: 20,
    color: 'red'
  },
  text: {
    fontSize: 20,
    marginBottom: 20
  },
  connectBtn: {
    color: '#fff'
  }
}
