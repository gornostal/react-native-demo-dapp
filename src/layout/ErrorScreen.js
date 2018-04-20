import React from 'react'
import { Text, View } from 'react-native'

import AppLayout from './AppLayout'

const ErrorScreen = ({ children }) => (
  <AppLayout>
    <View style={{ alignSelf: 'auto' }}>
      <Text>{children + ''}</Text>
    </View>
  </AppLayout>
)

export default ErrorScreen
