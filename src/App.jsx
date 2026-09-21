import CakeContainer from './Components/Cakecontainer.jsx'
import CakeInventory from './Components/CakeInventory.jsx'
import IceCreamContainer from './Components/IceCreamContainer.jsx'
import SummaryPanel from './Components/SummaryPanel.jsx'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-tag">Sweet Crumbs</p>
          <h1>Cake Shop Redux Demo</h1>
        </div>
      </header>

      <main className="shop-grid">
        <CakeContainer />
        <IceCreamContainer />
        <CakeInventory />
        <SummaryPanel />
      </main>
    </div>
  )
}

export default App
