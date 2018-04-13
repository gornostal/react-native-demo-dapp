import React, { Component } from 'react'
import { Text, Image } from 'react-native'

import { Form, Item, Input, Button } from 'native-base'
import rpsImage from '../../assets/rock-paper-scissors.png'
import AppLayout from '../layout/AppLayout'

class EnterGameName extends Component {
  render() {
    return (
      <AppLayout title="Create or join a game">
        <Image style={styles.image} source={rpsImage} />
        <Form>
          <Item>
            <Input autoFocus placeholder="Game name" />
          </Item>
          <Button block primary>
            <Text style={styles.submitBtn}>Submit</Text>
          </Button>
        </Form>
      </AppLayout>
    )
  }
}

export default EnterGameName

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
