import {
  BUY_ICECREAM,
  BUY_ICECREAM_FAILURE,
  BUY_ICECREAM_REQUEST,
  BUY_ICECREAM_SUCCESS,
  RESTOCK_ICECREAMS,
} from './iceCreamTypes'

export const buyIceCream = () => ({
  type: BUY_ICECREAM,
})

export const restockIceCreams = (count = 5) => ({
  type: RESTOCK_ICECREAMS,
  payload: count,
})

export const buyIceCreamAsync = () => (dispatch) => {
  dispatch({ type: BUY_ICECREAM_REQUEST })

  setTimeout(() => {
    try {
      dispatch(buyIceCream())
      dispatch({ type: BUY_ICECREAM_SUCCESS })
    } catch (error) {
      dispatch({ type: BUY_ICECREAM_FAILURE, payload: error.message })
    }
  }, 900)
}
