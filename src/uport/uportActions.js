import { combineReducers } from 'redux'
import makeTypesActionsReducer from '../utils/makeTypesActionsReducer'
import { requestCredentials } from './uportApi'

const { actions: loadCredentialsActions, reducer: credentials } = makeTypesActionsReducer(
  'UPORT/GET_CACHED_CREDENTIALS',
  requestCredentials
)
const { actions: requestCredentialsActions, reducer: reqCredentials } = makeTypesActionsReducer(
  'UPORT/REQUEST_CREDENTIALS',
  requestCredentials
)

export const actions = {
  requestCredentials: requestCredentialsActions.asyncRequest,
  getCachedCredentials: loadCredentialsActions.asyncRequest
}

export const reducer = combineReducers({ credentials, reqCredentials })
