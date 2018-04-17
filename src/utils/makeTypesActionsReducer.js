export default function make(typePrefix, requestFn) {
  const initState = {
    fetching: false,
    payload: null,
    error: null
  }

  const types = {
    ASYNC_REQUEST: `${typePrefix}/ASYNC_REQUEST`,
    RESET_STATE: `${typePrefix}/RESET_STATE`
  }

  const actions = {
    asyncRequest(...args) {
      return {
        type: types.ASYNC_REQUEST,
        payload: requestFn(...args),
        meta: { preservePayload: false }
      }
    },

    asyncRequestPreservePayload(...args) {
      return {
        type: types.ASYNC_REQUEST,
        payload: requestFn(...args),
        meta: { preservePayload: true }
      }
    },

    resetState() {
      return { type: types.RESET_STATE }
    }
  }

  const reducer = (state = initState, action) => {
    switch (action.type) {
      case `${types.ASYNC_REQUEST}_PENDING`:
        const newState = { ...state, fetching: true }
        if (!action.meta.preservePayload) {
          newState.payload = null
        }
        return newState

      case `${types.ASYNC_REQUEST}_REJECTED`:
        return {
          ...state,
          fetching: false,
          error: action.payload
        }

      case `${types.ASYNC_REQUEST}_FULFILLED`:
        return {
          ...state,
          fetching: false,
          error: null,
          payload: action.payload
        }

      case types.RESET_STATE:
        return { ...initState }

      default:
        return state
    }
  }

  return {
    types,
    actions,
    reducer
  }
}
