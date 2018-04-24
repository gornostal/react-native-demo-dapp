import React, { Component } from 'react'
import { Text } from 'react-native'
import { Button, Form, Toast } from 'native-base'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, getFormValues } from 'redux-form'
import { withNavigation } from 'react-navigation'

import LoadingScreen from '../layout/LoadingScreen'
import ErrorScreen from '../layout/ErrorScreen'
import makeFormSubmitHandler from '../utils/makeFormSubmitHandler'
import { FormInput } from '../layout/FormInput'
import AppLayout from '../layout/AppLayout'
import withAsyncData from '../utils/withAsyncData'
import withCredentials from '../uport/withCredentials'
import { joinGame, getBetValue } from '../rps/rpsApi'
import getWeb3 from '../utils/getWeb3'
import RpsShapeInput from '../rps/RpsShapeInput'

class JoinGame extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.props.betValue.load(this.getGameName())
  }

  getGameName() {
    return this.props.navigation.state.params.gameName
  }

  componentWillReceiveProps(newProps) {
    if (newProps.submitSucceeded) {
      newProps.refreshGameStatus()
    }
    if (!this.props.error && newProps.error) {
      Toast.show({
        text: newProps.error + '',
        type: 'warning',
        buttonText: 'Okay'
      })
    }
  }

  onSubmit(formData) {
    const gameName = this.getGameName()
    return this.props.joinGame({ ...formData, gameName, betWei: this.props.betWei })
  }

  render() {
    const { handleSubmit, submitting, betValue } = this.props
    const title = 'Step 1 of 3. Join game'

    if (betValue.pending) {
      return <LoadingScreen title={title} />
    }

    if (betValue.error) {
      return <ErrorScreen error={betValue.error} />
    }

    return (
      <AppLayout title={title}>
        <Form>
          <FormInput name="fromAccount" type="text" label="Account" disabled />
          <FormInput name="bet" type="text" label="Your Bet" placeholder="ETH" disabled />
          <RpsShapeInput name="shape" />
          <Button disabled={submitting} block primary onPress={handleSubmit(this.onSubmit)} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Submit{submitting && '...'}</Text>
          </Button>
        </Form>
      </AppLayout>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  var initialValues
  var betWei = ''
  if (ownProps.betValue.data) {
    betWei = ownProps.betValue.data.toString()
    initialValues = {
      fromAccount: ownProps.credentials.ethAddress,
      bet: getWeb3().fromWei(betWei, 'ether')
    }
  }

  return {
    initialValues,
    betWei,
    formValues: getFormValues('JoinGameForm')(state),
    joinGame: makeFormSubmitHandler(joinGame)
  }
}

export default compose(
  withCredentials,
  withNavigation,
  withAsyncData('betValue', getBetValue),
  connect(mapStateToProps),
  reduxForm({ form: 'JoinGameForm' })
)(JoinGame)

const styles = {
  submitBtn: {
    marginTop: 30
  },
  submitBtnText: {
    color: '#fff'
  }
}
