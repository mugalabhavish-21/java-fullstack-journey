import {
  BUY_CAKE,
  BUY_CAKE_FAILURE,
  BUY_CAKE_REQUEST,
  BUY_CAKE_SUCCESS,
  RESTOCK_CAKES,
} from './cakeTypes'

export const buyCake = () => ({
  type: BUY_CAKE,
})

export const restockCakes = (count = 5) => ({
  type: RESTOCK_CAKES,
  payload: count,
})

export const buyCakeAsync = () => (dispatch) => {
  dispatch({ type: BUY_CAKE_REQUEST })

  setTimeout(() => {
    try {
      dispatch(buyCake())
      dispatch({ type: BUY_CAKE_SUCCESS })
    } catch (error) {
      dispatch({ type: BUY_CAKE_FAILURE, payload: error.message })
    }
  }, 800)
}
