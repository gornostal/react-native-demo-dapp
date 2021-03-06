import React from 'react'
import { Text, View } from 'react-native'

import AppLayout from '../layout/AppLayout'

const WaitForOtherPlayer = () => (
  <AppLayout title="Waiting for the other player...">
    <View style={{ alignSelf: 'auto' }}>
      <Text>WaitForOtherPlayer</Text>
    </View>
  </AppLayout>
)

export default WaitForOtherPlayer
