import React, { Component } from 'react'
import { Text } from 'react-native'
import Hyperlink from 'react-native-hyperlink'

import AppLayout from '../layout/AppLayout'

class About extends Component {
  render() {
    return (
      <AppLayout title="About">
        <Hyperlink linkStyle={{ color: '#2980b9' }}>
          <Text style={{ fontSize: 15, marginBottom: 10 }}>
            This is a demo project that uses Ethereum contracts deployed with Truffle and React Native + Redux
            libraries.
          </Text>
          <Text>Check out source code here https://github.com/gornostal/demo-dapps</Text>
        </Hyperlink>
      </AppLayout>
    )
  }
}

export default About
