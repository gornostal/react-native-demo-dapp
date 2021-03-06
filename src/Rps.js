import React from 'react'
import { Root } from 'native-base'
import { Provider } from 'react-redux'
import { StackNavigator } from 'react-navigation'
import { applyMiddleware, createStore } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'

import reducer from './reducers'
import EnterGameName from './screens/EnterGameName'
import GameWizard from './screens/GameWizard'
import About from './screens/About'

const AppNavigator = StackNavigator(
  {
    EnterGameName: { screen: EnterGameName },
    GameWizard: { screen: GameWizard },
    About: { screen: About }
  },
  {
    initialRouteName: 'GameWizard',
    initialRouteParams: { gameName: 'abc' },
    headerMode: 'none',
    // disable animations
    transitionConfig: () => ({ screenInterpolator: () => null })
  }
)

const store = createStore(reducer, applyMiddleware(promiseMiddleware()))

export default () => (
  <Root>
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  </Root>
)
