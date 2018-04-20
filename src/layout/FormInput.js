import React from 'react'
import { Field } from 'redux-form'
import { Text, View } from 'react-native'
import { Item, Picker, Input, Label, Icon } from 'native-base'

const parseNumber = value => Number(value)

const ReactNativeInput = ({ input, label, meta, disabled, placeholder, comment }) => (
  <Item stackedLabel error={meta.error}>
    <Label>{label}</Label>
    <Input
      defaultValue={input.value}
      disabled={disabled}
      onChangeText={input.onChange}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      placeholder={placeholder}
    />
    {meta.error && <Icon name="close-circle" />}
    {(meta.error || comment) && <Text>{meta.error || comment}</Text>}
  </Item>
)

export const FormInput = props => (
  <Field component={ReactNativeInput} parse={props.type === 'number' ? parseNumber : null} {...props} />
)

const ReactNativePicker = ({ options, input, label, meta, disabled, placeholder, comment }) => (
  <View>
    <Item stackedLabel error={meta.error}>
      <Label>{label}</Label>
    </Item>
    <Picker
      mode="dropdown"
      iosHeader="Select a shape"
      style={{ width: undefined }}
      onValueChange={i => console.log('onValueChange', i)}
      selectedValue={i => console.log('selectedValue', i)}
    >
      {options.map(({ value, displayValue }) => <Item key={value} label={displayValue} value={value} />)}
    </Picker>
    {meta.error && <Icon name="close-circle" />}
    {(meta.error || comment) && <Text>{meta.error || comment}</Text>}
  </View>
)

export const FormPicker = props => (
  <Field component={ReactNativePicker} parse={props.type === 'number' ? parseNumber : null} {...props} />
)
