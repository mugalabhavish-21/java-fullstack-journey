import { useEffect, useMemo, useState } from 'react';

const jobsSeed = [
  { id: 1, title: 'React Frontend Developer', company: 'Nova Labs', location: 'Hyderabad', type: 'Full Time', level: 'Fresher', salary: '₹4.5–6 LPA', skills: ['React', 'JavaScript', 'REST API'], description: 'Build responsive interfaces, reusable components and API-driven features with React.' },
  { id: 2, title: 'Full Stack Developer', company: 'Helical IT Solutions', location: 'Hyderabad', type: 'Full Time', level: 'Fresher', salary: '₹3.5 LPA', skills: ['HTML', 'CSS', 'React', 'Node.js'], description: 'Work on modern web applications using React, REST APIs, Git and backend technologies.' },
  { id: 3, title: 'Java Developer Intern', company: 'CodeCraft Systems', location: 'Bengaluru', type: 'Internship', level: 'Intern', salary: '₹20k / month', skills: ['Java', 'Spring Boot', 'SQL'], description: 'Develop REST services and integrate frontend applications with Spring Boot APIs.' },
  { id: 4, title: 'UI Engineer', company: 'PixelWorks', location: 'Pune', type: 'Full Time', level: 'Junior', salary: '₹5–7 LPA', skills: ['React', 'CSS', 'Figma'], description: 'Translate product designs into accessible, high-performance React components.' },
  { id: 5, title: 'Frontend Engineer', company: 'CloudNest', location: 'Remote', type: 'Full Time', level: 'Junior', salary: '₹6–9 LPA', skills: ['React', 'TypeScript', 'Testing'], description: 'Create scalable frontend modules with clean state management and component architecture.' },
  { id: 6, title: 'Web Developer Intern', company: 'BrightByte', location: 'Hyderabad', type: 'Internship', level: 'Intern', salary: '₹15k / month', skills: ['HTML', 'CSS', 'JavaScript'], description: 'Build and maintain responsive pages while learning modern frontend practices.' }
];

const Icon = ({ children }) => <span className="icon" aria-hidden="true">{children}</span>;

function App() {
  const [jobs, setJobs] = useState(jobsSeed);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('All');
  const [type, setType] = useState('All');
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('hireflow-saved') || '[]'));
  const [applied, setApplied] = useState(() => JSON.parse(localStorage.getItem('hireflow-applied') || '[]'));
  const [dark, setDark] = useState(() => localStorage.getItem('hireflow-dark') === '1');
  const [selected, setSelected] = useState(null);
  const [savedOnly, setSavedOnly] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem('hireflow-saved', JSON.stringify(saved)), [saved]);
  useEffect(() => localStorage.setItem('hireflow-applied', JSON.stringify(applied)), [applied]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('hireflow-dark', dark ? '1' : '0');
  }, [dark]);

  const locations = ['All', ...new Set(jobs.map((job) => job.location))];
  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const text = `${job.title} ${job.company} ${job.skills.join(' ')} ${job.description}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) &&
      (location === 'All' || job.location === location) &&
      (type === 'All' || job.type === type) &&
      (!savedOnly || saved.includes(job.id));
  }), [jobs, query, location, type, savedOnly, saved]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1800);
  };

  const toggleSave = (id) => {
    setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const apply = (id) => {
    if (!applied.includes(id)) setApplied((items) => [...items, id]);
    showToast('Application saved successfully');
    setSelected(null);
  };

  const addDemoJob = () => {
    const id = Date.now();
    setJobs((items) => [{
      id, title: 'New React Opportunity', company: 'Demo Company', location: 'Hyderabad',
      type: 'Full Time', level: 'Fresher', salary: '₹4–6 LPA',
      skills: ['React', 'JavaScript', 'REST API'], description: 'Demo role added through React state and event handling.'
    }, ...items]);
    showToast('Demo job added');
  };

  const resetFilters = () => { setQuery(''); setLocation('All'); setType('All'); };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><div className="logo">&lt;/&gt;</div><div><b>HireFlow</b><span>React portfolio project</span></div></div>
        <nav>
          <button className={!savedOnly ? 'nav-active' : ''} onClick={() => setSavedOnly(false)}><Icon>▦</Icon> Jobs</button>
          <button className={savedOnly ? 'nav-active' : ''} onClick={() => setSavedOnly(true)}><Icon>☆</Icon> Saved <em>{saved.length}</em></button>
        </nav>
        <div className="actions"><button className="theme-btn" onClick={() => setDark((value) => !value)}>{dark ? '☀' : '☾'}</button><div className="avatar">BM</div></div>
      </header>

      <main>
        <section className="hero">
          <div><div className="eyebrow">✦ React + Vite portfolio project</div><h1>Find your next <span>opportunity.</span></h1><p>A responsive job board demonstrating React components, hooks, filtering, local persistence and interactive UI.</p></div>
          <div className="stats"><div><strong>{jobs.length}</strong><small>open roles</small></div><i></i><div><strong>{applied.length}</strong><small>applications</small></div></div>
        </section>

        <section className="toolbar">
          <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jobs, skills or companies..." /></label>
          <label className="select"><span>⌖</span><select value={location} onChange={(event) => setLocation(event.target.value)}>{locations.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="select"><span>☷</span><select value={type} onChange={(event) => setType(event.target.value)}><option>All</option><option>Full Time</option><option>Internship</option></select></label>
          <button className="secondary" onClick={resetFilters}>Reset</button>
        </section>

        <section className="content">
          <div className="section-head"><div><p className="muted">{savedOnly ? 'Saved jobs' : 'Latest opportunities'}</p><h2>{filteredJobs.length} positions found</h2></div><button className="add" onClick={addDemoJob}>＋ Add demo job</button></div>
          <div className="grid">
            {filteredJobs.map((job) => <article className="job-card" key={job.id}>
              <div className="job-top"><div className="company-logo">{job.company.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div><button className="save" onClick={() => toggleSave(job.id)} aria-label="Save job">{saved.includes(job.id) ? '★' : '☆'}</button></div>
              <p className="company">{job.company}</p><h3>{job.title}</h3>
              <div className="meta"><span>⌖ {job.location}</span><span>▣ {job.type}</span></div>
              <div className="tags">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <div className="job-bottom"><div><b>{job.salary}</b><small>{job.level}</small></div><button className="view" onClick={() => setSelected(job)}>View details →</button></div>
            </article>)}
          </div>
          {!filteredJobs.length && <div className="empty"><div>⌕</div><h3>No matching jobs</h3><p>Try a different keyword or reset the filters.</p></div>}
        </section>

        <section className="about"><div><div className="eyebrow">Built for a frontend interview</div><h2>What this project demonstrates</h2><p>Reusable React UI, controlled inputs, derived state with <code>useMemo</code>, side effects with <code>useEffect</code>, localStorage persistence, responsive CSS and accessible interactions.</p></div><div className="checks"><span>✓ React Hooks</span><span>✓ Search & filters</span><span>✓ CRUD-style UI</span><span>✓ Responsive design</span></div></section>
      </main>

      <footer><span>© 2026 Bhavish Mugala · React Portfolio Project</span><div><a href="https://github.com/mugalabhavish-21/java-fullstack-journey" target="_blank" rel="noreferrer">⌂ GitHub</a><a href="mailto:bhavish@example.com">✉ Contact</a></div></footer>

      {selected && <div className="overlay" onClick={() => setSelected(null)}><div className="modal" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setSelected(null)}>×</button><div className="modal-logo">{selected.company.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div><p className="company">{selected.company}</p><h2>{selected.title}</h2><div className="modal-meta"><span>⌖ {selected.location}</span><span>▣ {selected.type}</span><span>₹ {selected.salary}</span></div><p>{selected.description}</p><h4>Required skills</h4><div className="tags">{selected.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><button className="apply" onClick={() => apply(selected.id)}>{applied.includes(selected.id) ? '✓ Already applied' : 'Apply now →'}</button></div></div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

export default App;
