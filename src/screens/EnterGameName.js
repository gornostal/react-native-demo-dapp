import React, { Component } from 'react'
import { Text, Image } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Item, Input, Button } from 'native-base'

import rpsImage from '../../assets/rock-paper-scissors.png'
import AppLayout from '../layout/AppLayout'
import { loadCredentials } from '../uport/uportActions'

class EnterGameName extends Component {
  render() {
    // TODO: show loading, and uport screen if there are no credentials
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
        </Form>
      </AppLayout>
    )
  }
}

const mapStateToProps = state => ({
  credentials: state.uport.credentials
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ loadCredentials }, dispatch)
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
