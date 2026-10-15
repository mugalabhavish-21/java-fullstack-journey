import {
  BUY_ICECREAM,
  BUY_ICECREAM_FAILURE,
  BUY_ICECREAM_REQUEST,
  BUY_ICECREAM_SUCCESS,
  RESTOCK_ICECREAMS,
} from './iceCreamTypes'

const initialState = {
  numOfIceCreams: 15,
  loading: false,
  error: '',
}

const iceCreamReducer = (state = initialState, action) => {
  switch (action.type) {
    case BUY_ICECREAM_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      }
    case BUY_ICECREAM:
      return {
        ...state,
        numOfIceCreams: state.numOfIceCreams > 0 ? state.numOfIceCreams - 1 : 0,
      }
    case BUY_ICECREAM_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case BUY_ICECREAM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case RESTOCK_ICECREAMS:
      return {
        ...state,
        numOfIceCreams: state.numOfIceCreams + action.payload,
      }
    default:
      return state
  }
}

export default iceCreamReducer
