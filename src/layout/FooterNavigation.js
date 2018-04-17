import React, { Component } from 'react'
import { compose } from 'redux'
import { withNavigation } from 'react-navigation'
import { Button, Icon, Footer, FooterTab, Text } from 'native-base'

import withKeyboardState from '../utils/withKeyboardState'

const footerButtons = [
  {
    text: 'Create or join',
    routeName: 'EnterGameName',
    icon: 'plus-circle'
  },
  {
    text: 'About',
    routeName: 'About',
    icon: 'info-circle'
  }
]

class FooterNavigation extends Component {
  render() {
    const { isKeyboardVisible, navigation } = this.props
    if (isKeyboardVisible) {
      return null
    }

    return (
      <Footer>
        <FooterTab>
          {footerButtons.map(item => (
            <Button
              onPress={() => navigation.navigate(item.routeName)}
              key={item.routeName}
              vertical
              active={navigation.state.routeName === item.routeName}
            >
              <Icon type="FontAwesome" name={item.icon} active={navigation.state.routeName === item.routeName} />
              <Text>{item.text}</Text>
            </Button>
          ))}
        </FooterTab>
      </Footer>
    )
  }
}

export default compose(withKeyboardState, withNavigation)(FooterNavigation)
