import React from 'react'
import { Spinner } from 'native-base'

import AppLayout from './AppLayout'

const LoadingScreen = ({ title, noFooter }) => (
  <AppLayout title={title || 'Loading...'} noFooter={noFooter}>
    <Spinner />
  </AppLayout>
)

export default LoadingScreen
