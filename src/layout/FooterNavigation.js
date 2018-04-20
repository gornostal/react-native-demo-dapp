import React, { Component } from 'react'
import { compose } from 'redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { Button, Icon, Footer, FooterTab, Text } from 'native-base'

import withKeyboardState from '../utils/withKeyboardState'
import { actions } from '../uport/uportActions'
import withCredentials from '../uport/withCredentials'

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
    const { isKeyboardVisible, navigation, credentials, actions } = this.props
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
          {credentials && (
            <Button onPress={actions.clearCredentials} vertical>
              <Icon type="FontAwesome" name="sign-out" />
              <Text>Sign Out</Text>
            </Button>
          )}
        </FooterTab>
      </Footer>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default compose(connect(null, mapDispatchToProps), withCredentials, withKeyboardState, withNavigation)(
  FooterNavigation
)
