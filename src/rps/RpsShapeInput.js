import React from 'react'
import { Field } from 'redux-form'
import { Text, View } from 'react-native'
import { Button, Icon } from 'native-base'

const parseNumber = value => Number(value)

const RockPaperScissorsOptions = ({ label, meta, input, required }) => (
  <View style={styles.view}>
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
    {meta.error && <Text>{meta.error}</Text>}
  </View>
)

const RpsInput = props => (
  <Field component={RockPaperScissorsOptions} parse={props.type === 'number' ? parseNumber : null} {...props} />
)

export default RpsInput

const styles = {
  view: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20
  },
  btnText: {
    fontSize: 15,
    marginLeft: 10
  }
}
