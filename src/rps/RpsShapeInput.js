import React from 'react'
import { Field } from 'redux-form'
import { Text, View } from 'react-native'
import { Button, Icon } from 'native-base'

const parseNumber = value => Number(value)

const RockPaperScissorsOptions = ({ label, meta, input, required }) => (
  <View>
    <View style={styles.buttonView}>
      <Button
        iconLeft
        light
        onPress={() => {
          input.onChange('rock')
        }}
        info={input.value === 'rock'}
      >
        <Icon type="FontAwesome" name="hand-rock-o" />
        <Text style={styles.btnText}>Rock</Text>
      </Button>
      <Button
        iconLeft
        light
        onPress={() => {
          input.onChange('paper')
        }}
        info={input.value === 'paper'}
      >
        <Icon type="FontAwesome" name="hand-paper-o" />
        <Text style={styles.btnText}>Paper</Text>
      </Button>
      <Button
        iconLeft
        light
        onPress={() => {
          input.onChange('scissors')
        }}
        info={input.value === 'scissors'}
      >
        <Icon type="FontAwesome" name="hand-scissors-o" />
        <Text style={styles.btnText}>Scissors</Text>
      </Button>
    </View>
    {meta.error && <Text style={styles.error}>{meta.error}</Text>}
  </View>
)

const RpsInput = props => (
  <Field component={RockPaperScissorsOptions} parse={props.type === 'number' ? parseNumber : null} {...props} />
)

export default RpsInput

const styles = {
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20
  },
  error: {
    color: 'red',
    marginTop: 10
  },
  btnText: {
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 10
  }
}
