import React from 'react'
import { Spinner } from 'native-base'

import AppLayout from './AppLayout'

const LoadingScreen = ({ title }) => (
  <AppLayout title={title || 'Loading...'}>
    <Spinner />
  </AppLayout>
)

export default LoadingScreen
