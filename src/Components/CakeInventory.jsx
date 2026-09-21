import { useSelector } from 'react-redux'

function CakeInventory() {
  const numOfCakes = useSelector((state) => state.cake.numOfCakes)
  const numOfIceCreams = useSelector((state) => state.iceCream.numOfIceCreams)

  return (
    <div className="inventory-panel">
      <p className="label">Current stock</p>
      <div className="inventory-row">
        <div>
          <h3>{numOfCakes}</h3>
          <span>Cakes</span>
        </div>
        <div>
          <h3>{numOfIceCreams}</h3>
          <span>Ice creams</span>
        </div>
      </div>
    </div>
  )
}

export default CakeInventory
