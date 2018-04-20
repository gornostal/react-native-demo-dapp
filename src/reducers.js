import { combineReducers } from 'redux'

import { reducer as form } from 'redux-form'
import { reducer as uport } from './uport/uportActions'
import { reducer as rps } from './rps/rpsActions'

const appReducer = combineReducers({ form, uport, rps })

export default appReducer
