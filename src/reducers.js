import { combineReducers } from 'redux'

import { reducer as uport } from './uport/uportActions'

const appReducer = combineReducers({
  uport
})

export default appReducer
