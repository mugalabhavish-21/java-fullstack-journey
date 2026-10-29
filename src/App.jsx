import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API = (import.meta.env.VITE_API_BASE_URL || 'https://java-fullstack-journey-production.up.railway.app/api').replace(/\/$/, '')
const SAVED_KEY = 'hireflow-saved-job-ids'
const readSaved = () => { try { const v = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); return Array.isArray(v) ? v : [] } catch { return [] } }
const normalize = (job) => ({ ...job, skills: Array.isArray(job.skills) ? job.skills : String(job.skills || '').split(',').map(s => s.trim()).filter(Boolean) })

export default function App() {
  const [jobs, setJobs] = useState([])
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All locations')
  const [type, setType] = useState('All types')
  const [sort, setSort] = useState('recommended')
  const [saved, setSaved] = useState(readSaved)
  const [savedOnly, setSavedOnly] = useState(false)
  const [selected, setSelected] = useState(null)
  const [dark, setDark] = useState(() => localStorage.getItem('hireflow-theme') === 'dark')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [applying, setApplying] = useState(null)

  useEffect(() => { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)) }, [saved])
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('hireflow-theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (location !== 'All locations') params.set('location', location)
    if (type !== 'All types') params.set('type', type)
    setStatus('loading'); setError('')
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(API + '/jobs?' + params.toString(), { signal: controller.signal })
        if (!response.ok) throw new Error('Job service returned HTTP ' + response.status)
        const data = await response.json()
        if (!Array.isArray(data)) throw new Error('Unexpected response from job service')
        setJobs(data.map(normalize)); setStatus('success')
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'Could not load jobs'); setStatus('error')
      }
    }, 250)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [query, location, type])

  const locations = ['All locations', 'Hyderabad', 'Bengaluru', 'Pune', 'Remote', 'Chennai', 'Mumbai']
  const visible = useMemo(() => {
    const list = savedOnly ? jobs.filter(j => saved.includes(j.id)) : [...jobs]
    if (sort === 'title') list.sort((a,b) => a.title.localeCompare(b.title))
    if (sort === 'company') list.sort((a,b) => a.company.localeCompare(b.company))
    return list
  }, [jobs, savedOnly, saved, sort])

  function notify(message) { setToast(message); window.setTimeout(() => setToast(''), 3000) }
  function toggleSaved(job) {
    const exists = saved.includes(job.id)
    setSaved(ids => exists ? ids.filter(id => id !== job.id) : [...ids, job.id])
    notify(exists ? 'Removed from saved jobs' : 'Job saved for later')
  }
  async function apply(job) {
    setApplying(job.id)
    try {
      const response = await fetch(API + '/jobs/' + job.id + '/apply', { method: 'POST' })
      if (!response.ok) throw new Error('Application endpoint returned HTTP ' + response.status)
      notify('Demo request acknowledged. Applications are not stored yet.')
    } catch (err) { notify(err.message || 'Could not send request') }
    finally { setApplying(null) }
  }
  function reset() { setQuery(''); setLocation('All locations'); setType('All types'); setSavedOnly(false) }

  return <div className="app">
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark">H</span><span><strong>hireflow</strong><small>Find work that moves you.</small></span></a>
      <nav aria-label="Main navigation"><button className={!savedOnly ? 'nav-link active' : 'nav-link'} onClick={() => setSavedOnly(false)}>Find jobs</button><button className={savedOnly ? 'nav-link active' : 'nav-link'} onClick={() => setSavedOnly(true)}>Saved jobs <span className="nav-count">{saved.length}</span></button></nav>
      <button className="theme-toggle" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? '☀' : '☾'}</button>
    </header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><span className="eyebrow"><i className="pulse" /> YOUR NEXT CHAPTER STARTS HERE</span><h1>Find a job that<br/><em>fits your future.</em></h1><p>Thoughtful opportunities for people ready to do meaningful work. Find your next role, save the ones you love, and take the next step.</p><div className="hero-points"><span>✓ Curated opportunities</span><span>✓ Career possibilities</span></div></div>
        <div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-card"><span className="art-icon">↗</span><div className="art-lines"><i/><i/><i/></div><b>Your next move</b></div><div className="art-float float-top">✳ &nbsp; Grow with purpose</div><div className="art-float float-bottom">✓ &nbsp; New possibilities</div></div>
      </section>
      <section className="search-panel" aria-label="Search jobs"><label className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Job title, company, or skill" aria-label="Search jobs"/></label><label className="filter-box"><span>⌖</span><select value={location} onChange={e => setLocation(e.target.value)} aria-label="Location">{locations.map(l => <option key={l}>{l}</option>)}</select></label><label className="filter-box"><span>▤</span><select value={type} onChange={e => setType(e.target.value)} aria-label="Employment type"><option>All types</option><option>Full Time</option><option>Part Time</option><option>Contract</option><option>Internship</option><option>Remote</option></select></label><button className="clear-button" onClick={reset}>Reset</button></section>
      <section className="jobs-section" id="jobs"><div className="section-heading"><div><span className="eyebrow">THE OPPORTUNITY BOARD</span><h2>{savedOnly ? 'Your saved jobs' : 'Explore open roles'}<span className="heading-dot">.</span></h2><p>{savedOnly ? 'Your shortlist, all in one place.' : 'A good next step can change everything.'}</p></div><label className="sort-control">Sort by <select value={sort} onChange={e => setSort(e.target.value)}><option value="recommended">Recommended</option><option value="title">Job title</option><option value="company">Company</option></select></label></div>
        {status === 'loading' && <div className="state-panel"><span className="spinner"/><strong>Finding opportunities…</strong><p>Loading jobs from HireFlow.</p></div>}
        {status === 'error' && <div className="state-panel"><strong>We couldn't load the jobs.</strong><p>{error}</p><button className="primary-button" onClick={() => { setStatus('loading'); setQuery(q => q + ' ') }}>Try again</button><small>Check that the Spring Boot API is online and CORS allows this frontend.</small></div>}
        {status === 'success' && visible.length === 0 && <div className="state-panel"><strong>{savedOnly ? 'No saved jobs yet' : 'No matching jobs found'}</strong><p>{savedOnly ? 'Save a job and it will appear here.' : 'Try a different keyword or clear your filters.'}</p><button className="secondary-button" onClick={reset}>Clear filters</button></div>}
        {status === 'success' && visible.length > 0 && <div className="job-grid">{visible.map(job => {
          const initials = (job.company || 'HF').split(/\s+/).map(p => p[0]).join('').slice(0,2).toUpperCase()
          const isSaved = saved.includes(job.id)
          return <article className="job-card" key={job.id}><div className="job-card-top"><div className={'company-logo logo-' + (Number(job.id)%5)}>{initials}</div><button className={isSaved ? 'save-button saved' : 'save-button'} onClick={() => toggleSaved(job)} aria-label={isSaved ? 'Unsave ' + job.title : 'Save ' + job.title}>{isSaved ? '♥' : '♡'}</button></div><div className="job-meta"><span className="job-type">{job.type || 'Opportunity'}</span><span>{job.level || 'All levels'}</span></div><h3>{job.title}</h3><p className="company-name">{job.company}</p><p className="job-description">{job.description || 'Explore this opportunity and learn more about the role.'}</p><div className="job-facts"><span>⌖ {job.location}</span>{job.salary && <span className="salary">{job.salary}</span>}</div><div className="skill-list">{job.skills.slice(0,4).map(skill => <span key={skill}>{skill}</span>)}</div><div className="job-card-footer"><button className="details-button" onClick={() => setSelected(job)}>View details <span>↗</span></button><button className="apply-button" onClick={() => apply(job)} disabled={applying === job.id}>{applying === job.id ? 'Sending…' : 'Quick apply'}</button></div></article>
        })}</div>}
      </section>
      <section className="bottom-cta"><div className="cta-icon">✦</div><div><span className="eyebrow">YOUR FUTURE ISN'T ONE-SIZE-FITS-ALL</span><h2>One good opportunity can change everything.</h2><p>Keep exploring. Your next chapter might be closer than you think.</p></div><a className="cta-link" href="#jobs">Explore roles ↗</a></section>
    </main>
    <footer className="footer"><a className="footer-brand" href="#top">hireflow<span>.</span></a><span>Built for the next step in your career.</span><span>React · Spring Boot · REST API</span></footer>
    {selected && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null) }}><section className="job-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close">×</button><div className="company-logo modal-logo">{(selected.company || 'HF').split(/\s+/).map(p => p[0]).join('').slice(0,2).toUpperCase()}</div><span className="eyebrow">ROLE DETAILS</span><h2 id="modal-title">{selected.title}</h2><p className="company-name">{selected.company} · {selected.location}</p><div className="modal-facts"><span>{selected.type}</span><span>{selected.level || 'All levels'}</span>{selected.salary && <span>{selected.salary}</span>}</div><h3>About the role</h3><p className="modal-description">{selected.description || 'No detailed description has been provided.'}</p><h3>Skills</h3><div className="skill-list">{selected.skills.length ? selected.skills.map(s => <span key={s}>{s}</span>) : <span>Not specified</span>}</div><div className="modal-actions"><button className="secondary-button" onClick={() => toggleSaved(selected)}>{saved.includes(selected.id) ? '♥ Saved' : '♡ Save job'}</button><button className="apply-button" onClick={() => apply(selected)} disabled={applying === selected.id}>{applying === selected.id ? 'Sending…' : 'Quick apply'}</button></div><small className="demo-note">Quick apply calls the current demo endpoint; applications are not yet stored in the database.</small></section></div>}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>
}
