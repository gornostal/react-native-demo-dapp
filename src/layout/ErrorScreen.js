import React from 'react'
import { Text, View } from 'react-native'
import { H1 } from 'native-base'

import AppLayout from './AppLayout'

const ErrorScreen = ({ title, children, error, noFooter }) => (
  <AppLayout title={title || 'Error'} noFooter={noFooter}>
    <View style={{ alignSelf: 'auto' }}>
      {title && <H1 style={{ marginBottom: 20 }}>Error</H1>}
      {children}
      {error && <Text style={{ fontSize: 20 }}>{error}</Text>}
    </View>
  </AppLayout>
)

export default ErrorScreen
