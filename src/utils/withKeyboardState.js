import React, { Component } from 'react'
import { Keyboard } from 'react-native'

/**
 * HOC that passes isKeyboardVisible prop
 */
export default function withKeyboardState(WrappedComponent) {
  class WithKeyboardState extends Component {
    constructor(props) {
      super(props)
      this.state = { isKeyboardVisible: false }
    }

    componentDidMount() {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        this.setState({ isKeyboardVisible: true })
      })
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        this.setState({ isKeyboardVisible: false })
      })
    }

    componentWillUnmount() {
      this.keyboardDidShowListener.remove()
      this.keyboardDidHideListener.remove()
    }

    render() {
      return <WrappedComponent isKeyboardVisible={this.state.isKeyboardVisible} {...this.props} />
    }
  }

  WithKeyboardState.displayName = `WithKeyboardState-(${getDisplayName(WrappedComponent)})`

  return WithKeyboardState
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
