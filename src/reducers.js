import { combineReducers } from 'redux'

import { reducer as uport } from './uport/uportActions'
import { reducer as rps } from './rps/rpsActions'

const appReducer = combineReducers({ uport, rps })

export default appReducer
