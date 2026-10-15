import {
  BUY_CAKE,
  BUY_CAKE_FAILURE,
  BUY_CAKE_REQUEST,
  BUY_CAKE_SUCCESS,
  RESTOCK_CAKES,
} from './cakeTypes'

const initialState = {
  numOfCakes: 10,
  loading: false,
  error: '',
}

const cakeReducer = (state = initialState, action) => {
  switch (action.type) {
    case BUY_CAKE_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      }
    case BUY_CAKE:
      return {
        ...state,
        numOfCakes: state.numOfCakes > 0 ? state.numOfCakes - 1 : 0,
      }
    case BUY_CAKE_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case BUY_CAKE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case RESTOCK_CAKES:
      return {
        ...state,
        numOfCakes: state.numOfCakes + action.payload,
      }
    default:
      return state
  }
}

export default cakeReducer
