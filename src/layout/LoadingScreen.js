import React from 'react'
import { Text, View } from 'react-native'

import AppLayout from './AppLayout'

const LoadingScreen = () => (
  <AppLayout>
    <View style={{ alignSelf: 'auto' }}>
      <Text>Loading...</Text>
    </View>
  </AppLayout>
)

export default LoadingScreen
