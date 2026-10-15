import { useDispatch, useSelector } from 'react-redux'
import { restockCakes } from '../redux/cake/cakeActions'
import { restockIceCreams } from '../redux/iceCream/iceCreamActions'

function SummaryPanel() {
  const cakeCount = useSelector((state) => state.cake.numOfCakes)
  const iceCreamCount = useSelector((state) => state.iceCream.numOfIceCreams)
  const dispatch = useDispatch()

  const totalItems = cakeCount + iceCreamCount

  return (
    <div className="summary-panel">
      <p className="eyebrow">Store summary</p>
      <h2>{totalItems} items in stock</h2>
      <div className="summary-metrics">
        <div>
          <span>Cakes</span>
          <strong>{cakeCount}</strong>
        </div>
        <div>
          <span>Ice creams</span>
          <strong>{iceCreamCount}</strong>
        </div>
      </div>

      <button
        type="button"
        className="restock-button"
        onClick={() => {
          dispatch(restockCakes(5))
          dispatch(restockIceCreams(5))
        }}
      >
        Restock both
      </button>
    </div>
  )
}

export default SummaryPanel
