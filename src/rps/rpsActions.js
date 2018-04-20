import { combineReducers } from 'redux'
import makeTypesActionsReducer from '../utils/makeTypesActionsReducer'
import { getGameStatus } from './rpsApi'

const { actions: gameStatusActions, reducer: gameStatus } = makeTypesActionsReducer('RPS/GET_STATUS', getGameStatus)

export const actions = { getGameStatus: gameStatusActions.asyncRequest }

export const reducer = combineReducers({ gameStatus })
