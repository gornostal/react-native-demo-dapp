import React, { Component } from 'react'
import { Text, Image } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Item, Input, Button } from 'native-base'

import rpsImage from '../../assets/rock-paper-scissors.png'
import AppLayout from '../layout/AppLayout'
import LoadingScreen from '../layout/LoadingScreen'
import { actions } from '../uport/uportActions'
import UportConnect from './UportConnect'

class EnterGameName extends Component {
  constructor(props) {
    super(props)
    this.state = { beforeLoadCredentials: true }
  }

  componentDidMount() {
    this.props.actions.loadCredentials()
    this.setState({ beforeLoadCredentials: false })
  }

  render() {
    const { credentials } = this.props
    if (credentials.pending || this.state.beforeLoadCredentials) {
      return <LoadingScreen />
    }

    if (!credentials.payload) {
      return <UportConnect />
    }

    return (
      <AppLayout title="Create or join a game">
        <Image style={styles.image} source={rpsImage} />
        <Form>
          <Item>
            <Input placeholder="Game name" />
          </Item>
          <Button block primary>
            <Text style={styles.submitBtn}>Submit</Text>
          </Button>
          <Text>Name: {credentials.payload.name}</Text>
        </Form>
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

export default connect(mapStateToProps, mapDispatchToProps)(EnterGameName)

const styles = {
  image: {
    flex: 1,
    height: 100,
    marginTop: 30,
    marginBottom: 20,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  submitBtn: {
    color: '#fff'
  }
}
