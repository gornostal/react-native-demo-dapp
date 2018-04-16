import React from 'react'
import 'babel-preset-react-native-web3/globals'
import Setup from './src/boot/setup'

export default class App extends React.Component {
  render() {
    return <Setup />
  }
}
