import React from 'react'
import { Root } from 'native-base'
import { StackNavigator } from 'react-navigation'

import EnterGameName from './screens/EnterGameName'
import About from './screens/About'

const AppNavigator = StackNavigator(
  {
    EnterGameName: { screen: EnterGameName },
    About: { screen: About }
  },
  {
    initialRouteName: 'EnterGameName',
    headerMode: 'none',
    // disable animations
    transitionConfig: () => ({ screenInterpolator: () => null })
  }
)

export default () => (
  <Root>
    <AppNavigator />
  </Root>
)
