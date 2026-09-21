import { useDispatch, useSelector } from 'react-redux'
import { buyIceCreamAsync } from '../redux/iceCream/iceCreamActions'

function IceCreamContainer() {
  const numOfIceCreams = useSelector((state) => state.iceCream.numOfIceCreams)
  const loading = useSelector((state) => state.iceCream.loading)
  const error = useSelector((state) => state.iceCream.error)
  const dispatch = useDispatch()

  return (
    <div className="icecream-card">
      <p className="eyebrow">Frozen treats</p>
      <h2>{numOfIceCreams} ice creams available</h2>
      <button
        type="button"
        className="buy-button"
        onClick={() => dispatch(buyIceCreamAsync())}
        disabled={loading || numOfIceCreams === 0}
      >
        {loading ? 'Packing cone...' : numOfIceCreams === 0 ? 'Sold out' : 'Buy Ice Cream'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default IceCreamContainer
