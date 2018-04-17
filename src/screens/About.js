import React from 'react'
import { Text, View } from 'react-native'
import Hyperlink from 'react-native-hyperlink'

import AppLayout from '../layout/AppLayout'

const About = () => (
  <AppLayout title="About">
    <Hyperlink linkStyle={{ color: '#2980b9' }} linkDefault={true}>
      <View>
        <Text style={{ fontSize: 15, marginBottom: 10 }}>
          This is a demo project that uses Ethereum contracts deployed with Truffle and React Native + Redux libraries.
        </Text>
        <Text>Check out source code here https://github.com/gornostal/react-native-demo-dapp</Text>
      </View>
    </Hyperlink>
  </AppLayout>
)

export default About
