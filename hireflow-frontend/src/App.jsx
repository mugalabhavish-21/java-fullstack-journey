import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchJobs, fetchStats, applyJob, fetchMyApplications, fetchApplications,
  updateApplicationStatus, createJob, updateJob, deleteJob, fetchInterviews,
  scheduleInterview, fetchNotifications, markNotificationRead,
  fetchSavedJobs, saveJob, unsaveJob
} from './redux/jobsSlice';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
const authHeaders = () => ({
  Authorization: 'Bearer ' + (localStorage.getItem('hireflowToken') || ''),
  'Content-Type': 'application/json'
});

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || body?.error || 'Request failed (' + response.status + ')');
  return body;
}

const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Not scheduled';

function Login({ onLogin }) {
  const [role, setRole] = useState('APPLICANT');
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('applicant@hireflow.com');
  const [password, setPassword] = useState('applicant123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const chooseRole = (nextRole) => {
    setRole(nextRole);
    setEmail(nextRole === 'APPLICANT' ? 'applicant@hireflow.com' : 'recruiter@hireflow.com');
    setPassword(nextRole === 'APPLICANT' ? 'applicant123' : 'recruiter123');
    setMode('login');
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const payload = mode === 'register'
        ? { name: name.trim(), email: email.trim(), password, role: 'APPLICANT' }
        : { email: email.trim(), password, role };
      const response = await fetch(API + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Unable to sign in');
      localStorage.setItem('hireflowUser', JSON.stringify(data.user));
      localStorage.setItem('hireflowToken', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-aside">
        <div className="brand brand-light"><span className="brand-mark">H</span> HireFlow</div>
        <div className="auth-aside-copy">
          <span className="eyebrow light-eyebrow">CAREERS, CONNECTED</span>
          <h1>Find your next chapter.</h1>
          <p>A simpler way for candidates and hiring teams to move from opportunity to offer.</p>
          <div className="auth-feature"><span>01</span><div><b>Discover opportunities</b><small>Find roles that match your skills.</small></div></div>
          <div className="auth-feature"><span>02</span><div><b>Track every step</b><small>Keep applications and interviews organized.</small></div></div>
        </div>
        <div className="auth-footnote">HireFlow · Full-stack job portal</div>
      </div>
      <div className="auth-main">
        <div className="auth-card">
          <div className="brand brand-mobile"><span className="brand-mark">H</span> HireFlow</div>
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h2>{mode === 'register' ? 'Create your applicant account' : 'Welcome back'}</h2>
          <p className="muted">{mode === 'register' ? 'Start tracking opportunities in one place.' : 'Choose a workspace and continue where you left off.'}</p>
          {mode === 'login' && (
            <div className="role-tabs">
              <button type="button" className={role === 'APPLICANT' ? 'active' : ''} onClick={() => chooseRole('APPLICANT')}>Applicant</button>
              <button type="button" className={role === 'RECRUITER' ? 'active' : ''} onClick={() => chooseRole('RECRUITER')}>Recruiter</button>
            </div>
          )}
          <form className="form-stack" onSubmit={submit}>
            {mode === 'register' && <label>Full name<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required /></label>}
            <label>Email address<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label>
            <label>Password<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" minLength={mode === 'register' ? 8 : undefined} required /></label>
            {error && <div className="alert alert-error" role="alert">{error}</div>}
            <button className="button button-primary button-wide" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}</button>
          </form>
          {mode === 'login' ? (
            <>
              <div className="demo-note"><b>Demo access</b><span>{role === 'APPLICANT' ? 'applicant@hireflow.com / applicant123' : 'recruiter@hireflow.com / recruiter123'}</span></div>
              <p className="auth-switch">New to HireFlow? <button type="button" onClick={() => { setMode('register'); setRole('APPLICANT'); setEmail(''); setPassword(''); setError(''); }}>Create an applicant account</button></p>
            </>
          ) : (
            <p className="auth-switch">Already registered? <button type="button" onClick={() => { setMode('login'); setError(''); }}>Sign in</button></p>
          )}
        </div>
      </div>
    </div>
  );
}

function Header({ user, onLogout, unread }) {
  return (
    <header className="topbar">
      <a className="brand" href="#" onClick={(e) => e.preventDefault()}><span className="brand-mark">H</span> HireFlow</a>
      <div className="topbar-right">
        <span className="role-pill">{user.role === 'RECRUITER' ? 'Recruiter workspace' : 'Applicant workspace'}</span>
        <span className="user-avatar">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</span>
        <div className="user-block"><b>{user.name}</b><small>{user.email}</small></div>
        {unread > 0 && <span className="notification-count" title="Unread notifications">{unread}</span>}
        <button className="button button-ghost button-small" onClick={onLogout}>Log out</button>
      </div>
    </header>
  );
}

function Tabs({ items, active, onChange }) {
  return <nav className="tabs" aria-label="Workspace navigation">
    {items.map((item) => <button key={item.key} className={active === item.key ? 'tab active' : 'tab'} onClick={() => onChange(item.key)}>{item.label}</button>)}
  </nav>;
}

function EmptyState({ title, detail }) {
  return <div className="empty-state"><div className="empty-icon">⌁</div><h3>{title}</h3><p>{detail}</p></div>;
}

function NotificationPanel({ notifications, dispatch, flash }) {
  if (!notifications.length) return <EmptyState title="You’re all caught up" detail="Application and interview updates will appear here." />;
  return <div className="notification-list">{notifications.map((item) => (
    <article className={item.readFlag ? 'notification-item read' : 'notification-item'} key={item.id}>
      <span className="notification-dot" />
      <div className="notification-content"><p>{item.message}</p><small>{formatDate(item.createdAt)}</small></div>
      {!item.readFlag && <button className="button button-ghost button-small" onClick={async () => { try { await dispatch(markNotificationRead(item.id)).unwrap(); } catch (err) { flash(err.message); } }}>Mark read</button>}
    </article>
  ))}</div>;
}

function Applicant({ user, onLogout }) {
  const dispatch = useDispatch();
  const { page, status, error, myApplications, savedJobs, applyStatus, interviews, notifications } = useSelector((state) => state.jobs);
  const [tab, setTab] = useState('jobs');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('All');
  const [type, setType] = useState('All');
  const [profile, setProfile] = useState(null);
  const [flashMessage, setFlashMessage] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const jobs = page?.content || [];
  const unread = notifications.filter((item) => !item.readFlag).length;

  useEffect(() => {
    dispatch(fetchJobs({ page: 0, size: 30 }));
    dispatch(fetchMyApplications());
    dispatch(fetchSavedJobs());
    dispatch(fetchInterviews(false));
    dispatch(fetchNotifications());
    api('/profile').then(setProfile).catch((err) => setFlashMessage('Profile: ' + err.message));
  }, [dispatch]);

  const runSearch = (event) => {
    event.preventDefault();
    dispatch(fetchJobs({ q: query.trim(), location, type, page: 0, size: 30 }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      const saved = await api('/profile', { method: 'PUT', body: JSON.stringify(profile) });
      setProfile(saved);
      setFlashMessage('Profile saved successfully.');
    } catch (err) { setFlashMessage(err.message); }
    finally { setSavingProfile(false); }
  };

  const handleApply = async (job) => {
    try {
      await dispatch(applyJob(job.id)).unwrap();
      await Promise.all([dispatch(fetchMyApplications()), dispatch(fetchNotifications())]);
      setFlashMessage('Application submitted for ' + job.title + '.');
    } catch (err) { setFlashMessage(err.message || 'Unable to submit application.'); }
  };

  const toggleSavedJob = async (jobId, currentlySaved) => {
    try {
      if (currentlySaved) await dispatch(unsaveJob(jobId)).unwrap();
      else await dispatch(saveJob(jobId)).unwrap();
      await dispatch(fetchSavedJobs());
      setFlashMessage(currentlySaved ? 'Removed from saved jobs.' : 'Job saved for later.');
    } catch (err) { setFlashMessage(err.message || 'Unable to update saved jobs.'); }
  };

  const tabs = [
    { key: 'jobs', label: 'Find jobs' },
    { key: 'saved', label: 'Saved jobs (' + savedJobs.length + ')' },
    { key: 'applications', label: 'My applications (' + myApplications.length + ')' },
    { key: 'interviews', label: 'Interviews' },
    { key: 'profile', label: 'My profile' },
    { key: 'notifications', label: 'Notifications' + (unread ? ' · ' + unread : '') }
  ];

  return (
    <>
      <Header user={user} onLogout={onLogout} unread={unread} />
      <main className="workspace">
        <section className="page-hero">
          <div><span className="eyebrow light-eyebrow">APPLICANT DASHBOARD</span><h1>Good opportunities start here.</h1><p>Search roles, manage your applications, and stay ready for your next interview.</p></div>
          <div className="hero-graphic" aria-hidden="true"><span>H</span><i /><i /><i /></div>
        </section>
        <Tabs items={tabs} active={tab} onChange={setTab} />
        {flashMessage && <div className="alert alert-info"><span>{flashMessage}</span><button onClick={() => setFlashMessage('')} aria-label="Dismiss message">×</button></div>}
        {tab === 'jobs' && <>
          <section className="panel search-panel">
            <div className="section-heading"><div><span className="eyebrow">OPPORTUNITY SEARCH</span><h2>Find your next role</h2></div><span className="muted">{page?.totalElements ?? '—'} roles found</span></div>
            <form className="search-form" onSubmit={runSearch}>
              <label className="search-query">Search by role, company or skill<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Java Developer, React…" /></label>
              <label>Location<select value={location} onChange={(e) => setLocation(e.target.value)}><option>All</option><option>Hyderabad</option><option>Remote</option><option>Bengaluru</option><option>Pune</option></select></label>
              <label>Employment type<select value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Full Time</option><option>Internship</option><option>Part Time</option><option>Contract</option></select></label>
              <button className="button button-primary">Search jobs</button>
            </form>
          </section>
          {error && <div className="alert alert-error">{error}</div>}
          {status === 'loading' ? <div className="loading-state">Loading opportunities…</div> : jobs.length ? <section className="job-list">{jobs.map((job) => {
            const applied = myApplications.some((item) => item.jobId === job.id);
            const saved = savedJobs.some((item) => item.jobId === job.id);
            return <article className="job-card" key={job.id}>
              <div className="company-logo">{(job.company || 'H').charAt(0).toUpperCase()}</div>
              <div className="job-main"><div className="job-title-row"><h3>{job.title}</h3><span className="status-chip chip-neutral">{job.level || 'Open role'}</span></div><p className="job-company">{job.company} <span>·</span> {job.location}</p><p className="job-description">{job.description || 'Join the team and build impactful products.'}</p><div className="tag-list">{(job.skills || '').split(',').filter(Boolean).map((skill) => <span key={skill.trim()}>{skill.trim()}</span>)}</div><div className="job-meta"><span>◷ {job.type}</span><span>₹ {job.salary || 'Salary not disclosed'}</span></div></div>
              <div className="job-actions"><button className="button button-outline button-small" onClick={() => toggleSavedJob(job.id, saved)}>{saved ? 'Saved ✓' : 'Save job'}</button><button className="button button-primary" disabled={applied || applyStatus === 'loading'} onClick={() => handleApply(job)}>{applied ? 'Applied' : applyStatus === 'loading' ? 'Submitting…' : 'Apply now'}</button></div>
            </article>;
          })}</section> : <EmptyState title="No jobs match your search" detail="Try a different keyword or clear the location and job-type filters." />}
        </>}
        {tab === 'saved' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">BOOKMARKED OPPORTUNITIES</span><h2>Saved jobs</h2></div><span className="metric-pill">{savedJobs.length} saved</span></div>
          {savedJobs.length ? <div className="manage-job-list">{savedJobs.map((item) => { const job = jobs.find((candidateJob) => candidateJob.id === item.jobId); return <article className="manage-job" key={item.id}><div className="company-logo">{(job?.company || 'H').charAt(0).toUpperCase()}</div><div className="manage-job-info"><h3>{job?.title || 'Job #' + item.jobId}</h3><p>{job ? job.company + ' · ' + job.location + ' · ' + job.type : 'This listing may no longer be active.'}</p></div><div className="manage-job-actions">{job && <button className="button button-outline button-small" onClick={() => setTab('jobs')}>Find role</button>}<button className="button button-danger button-small" onClick={() => toggleSavedJob(item.jobId, true)}>Remove</button></div></article>; })}</div> : <EmptyState title="No saved jobs yet" detail="Save roles that interest you and come back to them later." />}
        </section>}
        {tab === 'applications' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">YOUR PROGRESS</span><h2>My applications</h2></div><span className="metric-pill">{myApplications.length} total</span></div>
          {myApplications.length ? <div className="table-wrap"><table><thead><tr><th>Position</th><th>Date applied</th><th>Status</th></tr></thead><tbody>{myApplications.map((application) => {
            const job = jobs.find((item) => item.id === application.jobId);
            return <tr key={application.id}><td><b>{job?.title || 'Job #' + application.jobId}</b><small>{job?.company || 'Company details unavailable'}</small></td><td>{application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : '—'}</td><td><span className="status-chip">{application.status.replace('_', ' ')}</span></td></tr>;
          })}</tbody></table></div> : <EmptyState title="No applications yet" detail="Apply to a role to start tracking your progress here." />}
        </section>}
        {tab === 'interviews' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">UPCOMING CONVERSATIONS</span><h2>My interviews</h2></div></div>
          {interviews.length ? <div className="interview-list">{interviews.map((interview) => <article className="interview-card" key={interview.id}><div className="calendar-icon"><b>{new Date(interview.scheduledAt).getDate()}</b><span>{new Date(interview.scheduledAt).toLocaleString(undefined, { month: 'short' })}</span></div><div className="interview-info"><h3>{interview.type || 'Interview'}</h3><p>{formatDate(interview.scheduledAt)}</p><small>Application #{interview.applicationId} · {interview.status}</small></div>{interview.meetingLink && <a className="button button-outline" href={interview.meetingLink} target="_blank" rel="noreferrer">Join meeting</a>}</article>)}</div> : <EmptyState title="No interviews scheduled" detail="When a recruiter schedules an interview, the details will appear here." />}
        </section>}
        {tab === 'profile' && <section className="panel profile-panel"><div className="section-heading"><div><span className="eyebrow">MAKE A STRONG IMPRESSION</span><h2>Candidate profile</h2><p className="muted">Keep your details up to date for recruiters.</p></div></div>
          {profile ? <form className="profile-form" onSubmit={saveProfile}><label>Full name<input value={profile.name || ''} required onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label><label>Email address<input value={profile.email || user.email} disabled /></label><label>Phone number<input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 ..." /></label><label>Skills<input value={profile.skills || ''} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} placeholder="Java, React, SQL..." /></label><label>Education<input value={profile.education || ''} onChange={(e) => setProfile({ ...profile, education: e.target.value })} placeholder="MCA, University" /></label><label>Experience<input value={profile.experience || ''} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} placeholder="Fresher / experience summary" /></label><label className="full-span">Resume URL<input type="url" value={profile.resumeUrl || ''} onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })} placeholder="https://..." /></label><div className="full-span"><button className="button button-primary" disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save profile'}</button></div></form> : <div className="loading-state">Loading profile…</div>}
        </section>}
        {tab === 'notifications' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">STAY IN THE LOOP</span><h2>Notifications</h2></div><span className="metric-pill">{unread} unread</span></div><NotificationPanel notifications={notifications} dispatch={dispatch} flash={setFlashMessage} /></section>}
      </main>
    </>
  );
}

function Recruiter({ user, onLogout }) {
  const dispatch = useDispatch();
  const { stats, applications, page, error, interviews, notifications } = useSelector((state) => state.jobs);
  const [tab, setTab] = useState('overview');
  const [flashMessage, setFlashMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ scheduledAt: '', type: 'Technical', meetingLink: '' });
  const [form, setForm] = useState({ title: '', company: '', location: 'Hyderabad', type: 'Full Time', level: 'Fresher', salary: '', skills: '', description: '' });

  const jobs = page?.content || [];
  const unread = notifications.filter((item) => !item.readFlag).length;
  const jobById = useMemo(() => Object.fromEntries(jobs.map((job) => [job.id, job])), [jobs]);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchApplications());
    dispatch(fetchJobs({ page: 0, size: 50 }));
    dispatch(fetchInterviews(true));
    dispatch(fetchNotifications());
  }, [dispatch]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', company: '', location: 'Hyderabad', type: 'Full Time', level: 'Fresher', salary: '', skills: '', description: '' });
  };

  const postJob = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) await dispatch(updateJob({ id: editingId, job: form })).unwrap();
      else await dispatch(createJob(form)).unwrap();
      await Promise.all([dispatch(fetchJobs({ page: 0, size: 50 })), dispatch(fetchStats())]);
      setFlashMessage(editingId ? 'Job updated successfully.' : 'Job published successfully.');
      resetForm();
      setTab('jobs');
    } catch (err) { setFlashMessage(err.message || 'Unable to save job.'); }
    finally { setSaving(false); }
  };

  const removeJob = async (job) => {
    if (!window.confirm('Delete "' + job.title + '"?')) return;
    try { await dispatch(deleteJob(job.id)).unwrap(); await Promise.all([dispatch(fetchJobs({ page: 0, size: 50 })), dispatch(fetchStats())]); setFlashMessage('Job deleted.'); }
    catch (err) { setFlashMessage(err.message || 'Unable to delete job.'); }
  };

  const changeStatus = async (application, status) => {
    try {
      await dispatch(updateApplicationStatus({ id: application.id, status })).unwrap();
      await Promise.all([dispatch(fetchApplications()), dispatch(fetchNotifications())]);
      setFlashMessage('Application status updated.');
    } catch (err) { setFlashMessage(err.message || 'Unable to update status.'); }
  };

  const submitInterview = async (event) => {
    event.preventDefault();
    if (!scheduleTarget) return;
    try {
      await dispatch(scheduleInterview({
        applicationId: scheduleTarget.id,
        scheduledAt: new Date(interviewForm.scheduledAt).toISOString(),
        type: interviewForm.type,
        meetingLink: interviewForm.meetingLink
      })).unwrap();
      await dispatch(updateApplicationStatus({ id: scheduleTarget.id, status: 'INTERVIEW' })).unwrap();
      await Promise.all([dispatch(fetchApplications()), dispatch(fetchInterviews(true)), dispatch(fetchNotifications())]);
      setScheduleTarget(null);
      setInterviewForm({ scheduledAt: '', type: 'Technical', meetingLink: '' });
      setFlashMessage('Interview scheduled and candidate notified.');
    } catch (err) { setFlashMessage(err.message || 'Unable to schedule interview.'); }
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'jobs', label: 'Manage jobs (' + jobs.length + ')' },
    { key: 'post', label: editingId ? 'Edit job' : 'Post a job' },
    { key: 'applicants', label: 'Applicants (' + applications.length + ')' },
    { key: 'interviews', label: 'Interviews' },
    { key: 'notifications', label: 'Notifications' + (unread ? ' · ' + unread : '') }
  ];

  return (
    <>
      <Header user={user} onLogout={onLogout} unread={unread} />
      <main className="workspace">
        <section className="page-hero recruiter-hero"><div><span className="eyebrow light-eyebrow">RECRUITER DASHBOARD</span><h1>Build your next great team.</h1><p>Manage open roles, review candidates, and coordinate interviews from one workspace.</p></div><button className="button button-light" onClick={() => { resetForm(); setTab('post'); }}>+ Post a job</button></section>
        <Tabs items={tabs} active={tab} onChange={setTab} />
        {flashMessage && <div className="alert alert-info"><span>{flashMessage}</span><button onClick={() => setFlashMessage('')} aria-label="Dismiss message">×</button></div>}
        {tab === 'overview' && <>
          <section className="stats-grid">
            <div className="stat-card"><span>Total open roles</span><b>{stats?.totalJobs ?? jobs.length}</b><small>Listed opportunities</small></div>
            <div className="stat-card"><span>Full-time roles</span><b>{stats?.fullTimeJobs ?? 0}</b><small>Permanent positions</small></div>
            <div className="stat-card"><span>Internships</span><b>{stats?.internshipJobs ?? 0}</b><small>Early-career opportunities</small></div>
            <div className="stat-card"><span>Applications</span><b>{applications.length}</b><small>Across all job listings</small></div>
          </section>
          <section className="panel"><div className="section-heading"><div><span className="eyebrow">HIRING PIPELINE</span><h2>Application overview</h2></div><button className="button button-outline" onClick={() => setTab('applicants')}>Review applicants</button></div>
            <div className="pipeline-grid">{[['Applied', 'APPLIED'], ['In review', 'UNDER_REVIEW'], ['Shortlisted', 'SHORTLISTED'], ['Interview', 'INTERVIEW'], ['Selected', 'SELECTED'], ['Rejected', 'REJECTED']].map(([label, value]) => <div className="pipeline-item" key={value}><span>{label}</span><b>{applications.filter((item) => item.status === value).length}</b></div>)}</div>
          </section>
          <section className="panel"><div className="section-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Latest applicants</h2></div></div>
            {applications.length ? <div className="table-wrap"><table><thead><tr><th>Candidate</th><th>Position</th><th>Applied</th><th>Status</th></tr></thead><tbody>{applications.slice(0, 5).map((item) => <tr key={item.id}><td><b>{item.candidateEmail}</b></td><td>{jobById[item.jobId]?.title || 'Job #' + item.jobId}</td><td>{item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : '—'}</td><td><span className="status-chip">{item.status.replace('_', ' ')}</span></td></tr>)}</tbody></table></div> : <EmptyState title="No applicants yet" detail="Applications will appear here when candidates apply." />}
          </section>
        </>}
        {tab === 'jobs' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">ROLE MANAGEMENT</span><h2>Manage job listings</h2></div><button className="button button-primary" onClick={() => { resetForm(); setTab('post'); }}>+ New job</button></div>
          {jobs.length ? <div className="manage-job-list">{jobs.map((job) => <article className="manage-job" key={job.id}><div className="company-logo">{(job.company || 'H').charAt(0)}</div><div className="manage-job-info"><h3>{job.title}</h3><p>{job.company} · {job.location} · {job.type}</p></div><div className="manage-job-actions"><button className="button button-outline button-small" onClick={() => { setEditingId(job.id); setForm({ title: job.title || '', company: job.company || '', location: job.location || '', type: job.type || 'Full Time', level: job.level || '', salary: job.salary || '', skills: job.skills || '', description: job.description || '' }); setTab('post'); }}>Edit</button><button className="button button-danger button-small" onClick={() => removeJob(job)}>Delete</button></div></article>)}</div> : <EmptyState title="No jobs published" detail="Publish your first role to start building a candidate pipeline." />}
        </section>}
        {tab === 'post' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">JOB EDITOR</span><h2>{editingId ? 'Update job listing' : 'Publish an opportunity'}</h2><p className="muted">Required fields are marked in the form.</p></div></div>
          <form className="profile-form" onSubmit={postJob}>
            <label>Job title *<input value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Java Full Stack Developer" /></label>
            <label>Company *<input value={form.company} required onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" /></label>
            <label>Location *<input value={form.location} required onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Hyderabad / Remote" /></label>
            <label>Employment type *<select value={form.type} required onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Full Time</option><option>Internship</option><option>Part Time</option><option>Contract</option></select></label>
            <label>Level<input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Fresher / Junior / Mid-level" /></label>
            <label>Salary range<input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="₹4–6 LPA" /></label>
            <label className="full-span">Skills (comma-separated)<input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Java, Spring Boot, React, SQL" /></label>
            <label className="full-span">Description<textarea value={form.description} rows="4" onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the role and what the successful candidate will do." /></label>
            <div className="form-actions full-span"><button type="button" className="button button-ghost" onClick={() => { resetForm(); setTab('jobs'); }}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Publish job'}</button></div>
          </form>
        </section>}
        {tab === 'applicants' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">CANDIDATE PIPELINE</span><h2>Applicants</h2></div><span className="metric-pill">{applications.length} applications</span></div>
          {applications.length ? <div className="table-wrap"><table><thead><tr><th>Candidate</th><th>Position</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead><tbody>{applications.map((application) => <tr key={application.id}><td><b>{application.candidateEmail}</b></td><td>{jobById[application.jobId]?.title || 'Job #' + application.jobId}<small>{jobById[application.jobId]?.company || ''}</small></td><td>{application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : '—'}</td><td><select className="status-select" value={application.status} onChange={(e) => changeStatus(application, e.target.value)}><option value="APPLIED">Applied</option><option value="UNDER_REVIEW">Under review</option><option value="SHORTLISTED">Shortlisted</option><option value="INTERVIEW">Interview</option><option value="SELECTED">Selected</option><option value="REJECTED">Rejected</option></select></td><td><button className="button button-outline button-small" onClick={() => { setScheduleTarget(application); setInterviewForm({ scheduledAt: '', type: 'Technical', meetingLink: '' }); }}>Schedule interview</button></td></tr>)}</tbody></table></div> : <EmptyState title="No applications yet" detail="Once candidates apply, you can review them and update their status here." />}
        </section>}
        {tab === 'interviews' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">SCHEDULED INTERVIEWS</span><h2>Interview calendar</h2></div></div>
          {interviews.length ? <div className="interview-list">{interviews.map((item) => <article className="interview-card" key={item.id}><div className="calendar-icon"><b>{new Date(item.scheduledAt).getDate()}</b><span>{new Date(item.scheduledAt).toLocaleString(undefined, { month: 'short' })}</span></div><div className="interview-info"><h3>{item.type || 'Interview'}</h3><p>{formatDate(item.scheduledAt)}</p><small>{item.candidateEmail} · Application #{item.applicationId}</small></div>{item.meetingLink && <a className="button button-outline" href={item.meetingLink} target="_blank" rel="noreferrer">Meeting link</a>}</article>)}</div> : <EmptyState title="No interviews scheduled" detail="Schedule an interview from the Applicants tab." />}
        </section>}
        {tab === 'notifications' && <section className="panel"><div className="section-heading"><div><span className="eyebrow">STAY IN THE LOOP</span><h2>Notifications</h2></div><span className="metric-pill">{unread} unread</span></div><NotificationPanel notifications={notifications} dispatch={dispatch} flash={setFlashMessage} /></section>}
        {error && <div className="alert alert-error">{error}</div>}
      </main>
      {scheduleTarget && <div className="modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setScheduleTarget(null); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="schedule-title"><button className="modal-close" onClick={() => setScheduleTarget(null)} aria-label="Close">×</button><span className="eyebrow">INTERVIEW SCHEDULING</span><h2 id="schedule-title">Schedule an interview</h2><p className="muted">Candidate: {scheduleTarget.candidateEmail}</p><form className="form-stack" onSubmit={submitInterview}><label>Date and time<input type="datetime-local" required value={interviewForm.scheduledAt} min={(() => { const d = new Date(Date.now() + 60000); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); })()} onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })} /></label><label>Interview type<select value={interviewForm.type} onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}><option>Technical</option><option>HR</option><option>Managerial</option><option>Screening</option></select></label><label>Meeting link (optional)<input type="url" value={interviewForm.meetingLink} onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })} placeholder="https://meet.google.com/..." /></label><div className="form-actions"><button type="button" className="button button-ghost" onClick={() => setScheduleTarget(null)}>Cancel</button><button className="button button-primary">Schedule and notify</button></div></form></section></div>}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hireflowUser')) || null; }
    catch { return null; }
  });
  const logout = () => {
    localStorage.removeItem('hireflowUser');
    localStorage.removeItem('hireflowToken');
    setUser(null);
  };
  return user ? (user.role === 'RECRUITER' ? <Recruiter user={user} onLogout={logout} /> : <Applicant user={user} onLogout={logout} />) : <Login onLogin={setUser} />;
}
