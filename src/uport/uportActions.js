import { combineReducers } from 'redux'
import { getUport } from './uportApi'

const initState = {
  fetching: false,
  initialized: false,
  payload: null,
  error: null
}

const typePrefix = 'UPORT'
const types = {
  LOAD_CREDENTIALS: `${typePrefix}/LOAD_CREDENTIALS`,
  REQUEST_CREDENTIALS: `${typePrefix}/REQUEST_CREDENTIALS`,
  CLEAR_CREDENTIALS: `${typePrefix}/CLEAR_CREDENTIALS`
}

const actions = {
  loadCredentials() {
    return {
      type: types.LOAD_CREDENTIALS,
      payload: getUport().loadCredentials()
    }
  },

  requestCredentials() {
    return {
      type: types.REQUEST_CREDENTIALS,
      payload: getUport().requestCredentials()
    }
  },

  clearCredentials() {
    return {
      type: types.CLEAR_CREDENTIALS,
      payload: getUport().clearCredentials()
    }
  }
}

const credentialsReducer = (state = initState, action) => {
  switch (action.type) {
    case `${types.LOAD_CREDENTIALS}_PENDING`:
    case `${types.REQUEST_CREDENTIALS}_PENDING`:
    case `${types.CLEAR_CREDENTIALS}_PENDING`:
      return { ...state, fetching: true, initialized: true }

    case `${types.LOAD_CREDENTIALS}_REJECTED`:
    case `${types.REQUEST_CREDENTIALS}_REJECTED`:
    case `${types.CLEAR_CREDENTIALS}_REJECTED`:
      return {
        ...state,
        fetching: false,
        error: action.payload
      }

    case `${types.LOAD_CREDENTIALS}_FULFILLED`:
      return {
        ...state,
        fetching: false,
        error: null,
        payload: action.payload
      }

    case `${types.REQUEST_CREDENTIALS}_FULFILLED`:
      return {
        ...state,
        fetching: false,
        error: null,
        payload: action.payload
      }

    case `${types.CLEAR_CREDENTIALS}_FULFILLED`:
      return {
        ...state,
        fetching: false,
        error: null,
        payload: null
      }

    default:
      return state
  }
}

const reducer = combineReducers({ credentials: credentialsReducer })

export { types, actions, reducer }
