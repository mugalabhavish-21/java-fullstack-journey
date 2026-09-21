import { useDispatch, useSelector } from 'react-redux'
import { buyCakeAsync } from '../redux/cake/cakeActions'

function CakeContainer() {
  const numOfCakes = useSelector((state) => state.cake.numOfCakes)
  const loading = useSelector((state) => state.cake.loading)
  const error = useSelector((state) => state.cake.error)
  const dispatch = useDispatch()

  return (
    <div className="cake-card">
      <p className="eyebrow">Fresh bakery</p>
      <h2>{numOfCakes} cakes available</h2>
      <button
        type="button"
        className="buy-button"
        onClick={() => dispatch(buyCakeAsync())}
        disabled={loading || numOfCakes === 0}
      >
        {loading ? 'Preparing order...' : numOfCakes === 0 ? 'Sold out' : 'Buy Cake'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default CakeContainer
