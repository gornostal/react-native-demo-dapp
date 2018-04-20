import React from 'react'
import { Text, View } from 'react-native'

import AppLayout from '../layout/AppLayout'

const NewGame = () => (
  <AppLayout title="Step 1 of 3. Create a new game">
    <View style={{ alignSelf: 'auto' }}>
      <Text>NewGame</Text>
    </View>
  </AppLayout>
)

export default NewGame
