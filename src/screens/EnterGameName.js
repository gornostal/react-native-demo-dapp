import React, { Component } from 'react'
import { Text, Image, Keyboard } from 'react-native'
import { Form, Item, Input, Button } from 'native-base'

import rpsImage from '../../assets/rock-paper-scissors.png'
import AppLayout from '../layout/AppLayout'
import withCredentials from '../uport/withCredentials'
import UportConnect from './UportConnect'

class EnterGameName extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    Keyboard.dismiss()
    this.props.navigation.navigate('GameWizard', { gameName: this.state.gameName })
  }

  render() {
    const { credentials } = this.props

    if (!credentials) {
      return <UportConnect />
    }

    return (
      <AppLayout title="Create or join a game">
        <Image style={styles.image} source={rpsImage} />
        <Form>
          <Item>
            <Input autoFocus placeholder="Game name" onChangeText={gameName => this.setState({ gameName })} />
          </Item>
          <Button block primary onPress={this.onSubmit}>
            <Text style={styles.submitBtn}>Go</Text>
          </Button>
        </Form>
      </AppLayout>
    )
  }
}

export default withCredentials(EnterGameName)

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
