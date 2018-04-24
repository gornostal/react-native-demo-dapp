import React, { Component } from 'react'
import { Keyboard, Text } from 'react-native'
import { Button, Form, Toast } from 'native-base'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, getFormValues } from 'redux-form'

import makeFormSubmitHandler from '../utils/makeFormSubmitHandler'
import { FormInput } from '../layout/FormInput'
import AppLayout from '../layout/AppLayout'
import withCredentials from '../uport/withCredentials'
import { startGame } from '../rps/rpsApi'
import withGameStatus from '../rps/withGameStatus'
import RpsShapeInput from '../rps/RpsShapeInput'

class NewGame extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
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
    Keyboard.dismiss()
    const gameName = this.getGameName()
    return this.props.startGame({ ...formData, gameName })
  }

  render() {
    const { handleSubmit, submitting } = this.props

    return (
      <AppLayout title="Step 1 of 3. Create a new game">
        <Form>
          <FormInput name="fromAccount" type="text" label="Account" disabled />
          <FormInput name="bet" type="text" label="Your Bet" placeholder="ETH" />
          <RpsShapeInput name="shape" />
          <Button disabled={submitting} block primary onPress={handleSubmit(this.onSubmit)} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Submit{submitting && 'ing...'}</Text>
          </Button>
        </Form>
      </AppLayout>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: {
      fromAccount: ownProps.credentials.ethAddress
    },
    formValues: getFormValues('CreateGameForm')(state),
    startGame: makeFormSubmitHandler(startGame)
  }
}

export default compose(
  withCredentials,
  withGameStatus,
  connect(mapStateToProps),
  reduxForm({ form: 'CreateGameForm' })
)(NewGame)

const styles = {
  submitBtn: {
    marginTop: 30
  },
  submitBtnText: {
    color: '#fff'
  }
}
