import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCities, searchFlights } from './redux/flightSlice';
function App(){
  const dispatch=useDispatch();
  const {cities,results,status,error}=useSelector(s=>s.flights);
  const [source,setSource]=useState('');
  const [destination,setDestination]=useState('');
  useEffect(()=>{dispatch(fetchCities())},[dispatch]);
  const submit=(e)=>{
    e.preventDefault();
    if(!source||!destination){return;}
    if(source===destination){return;}
    dispatch(searchFlights({source,destination}));
  };
  const message = !source || !destination ? 'Select both cities to search.' :
    source===destination ? 'Source and destination must be different.' : '';
  return <div className="app">
    <header><div className="brand">✈ SkyRoute</div><span>Flight Search Portal</span></header>
    <main>
      <section className="hero"><p className="eyebrow">SMART FLIGHT SEARCH</p><h1>Find your next flight.</h1><p>Search direct and connecting routes across multiple airlines.</p>
        <form onSubmit={submit} className="search">
          <label>From<select value={source} onChange={e=>setSource(e.target.value)}><option value="">Select city</option>{cities.map(c=><option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}</select></label>
          <label>To<select value={destination} onChange={e=>setDestination(e.target.value)}><option value="">Select city</option>{cities.map(c=><option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}</select></label>
          <button disabled={status==='loading'}>{status==='loading'?'Searching...':'Search Flights'}</button>
        </form>
        {message&&<p className="validation">{message}</p>}
      </section>
      {error&&<div className="error">{error}</div>}
      {status==='succeeded'&&results.length===0&&<div className="empty">No flights found for this route.</div>}
      {results.length>0&&<section className="results"><div className="resultHead"><h2>Available flights</h2><span>{results.length} matching route{results.length>1?'s':''}</span></div>
        <div className="cards">{results.map(f=><article className="flight" key={f.id}>
          <div className="airline"><strong>{f.airline}</strong><small>{f.flightNumber}</small></div>
          <div><small>Departure</small><b>{f.departure}</b><span>{f.source}</span></div>
          <div className="duration"><small>{f.duration}</small><span>{f.stops===0?'Direct':f.stops+' stop'+(f.stops>1?'s':'')}</span></div>
          <div><small>Arrival</small><b>{f.arrival}</b><span>{f.destination}</span></div>
          <div><small>Stopover</small><span>{f.stopoverCity}</span></div>
          <div><small>Price</small><b>₹{f.price.toLocaleString('en-IN')}</b></div>
          <div className={f.available?'available':'unavailable'}>{f.available?'Available':'Sold out'}</div>
        </article>)}</div>
      </section>}
    </main>
  </div>;
}
export default App;