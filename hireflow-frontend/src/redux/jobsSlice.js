import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
const auth = () => ({ Authorization: 'Bearer ' + (localStorage.getItem('hireflowToken') || '') });

const request = async (path, options = {}) => {
  const response = await fetch(API + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...auth(), ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || body?.error || 'Request failed (' + response.status + ')');
  return body;
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params = {}) => {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.location && params.location !== 'All') query.set('location', params.location);
  if (params.type && params.type !== 'All') query.set('type', params.type);
  query.set('page', params.page ?? 0);
  query.set('size', params.size ?? 6);
  query.set('sortBy', params.sortBy || 'id');
  query.set('direction', params.direction || 'desc');
  return request('/jobs?' + query.toString());
});
export const fetchStats = createAsyncThunk('jobs/fetchStats', () => request('/jobs/stats'));
export const applyJob = createAsyncThunk('jobs/applyJob', (id) => request('/applications/' + id, { method: 'POST', body: JSON.stringify({}) }));
export const fetchMyApplications = createAsyncThunk('jobs/fetchMyApplications', () => request('/applications/mine'));
export const fetchApplications = createAsyncThunk('jobs/fetchApplications', () => request('/applications'));
export const updateApplicationStatus = createAsyncThunk('jobs/updateApplicationStatus', ({ id, status }) => request('/applications/' + id + '/status', { method: 'PATCH', body: JSON.stringify({ status }) }));
export const createJob = createAsyncThunk('jobs/createJob', (job) => request('/jobs', { method: 'POST', body: JSON.stringify(job) }));
export const updateJob = createAsyncThunk('jobs/updateJob', ({ id, job }) => request('/jobs/' + id, { method: 'PUT', body: JSON.stringify(job) }));
export const deleteJob = createAsyncThunk('jobs/deleteJob', (id) => request('/jobs/' + id, { method: 'DELETE' }));
export const fetchInterviews = createAsyncThunk('jobs/fetchInterviews', (recruiter = false) => request(recruiter ? '/interviews' : '/interviews/mine'));
export const scheduleInterview = createAsyncThunk('jobs/scheduleInterview', (interview) => request('/interviews', { method: 'POST', body: JSON.stringify(interview) }));
export const fetchNotifications = createAsyncThunk('jobs/fetchNotifications', () => request('/notifications'));
export const markNotificationRead = createAsyncThunk('jobs/markNotificationRead', (id) => request('/notifications/' + id + '/read', { method: 'PATCH' }));

const slice = createSlice({
  name: 'jobs',
  initialState: {
    page: null, stats: null, applications: [], myApplications: [], interviews: [], notifications: [],
    status: 'idle', statsStatus: 'idle', applyStatus: 'idle', error: null
  },
  reducers: { clearApply(state) { state.applyStatus = 'idle'; } },
  extraReducers(builder) {
    builder
      .addCase(fetchJobs.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchJobs.fulfilled, (state, action) => { state.status = 'succeeded'; state.page = action.payload; })
      .addCase(fetchJobs.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      .addCase(fetchStats.pending, (state) => { state.statsStatus = 'loading'; })
      .addCase(fetchStats.fulfilled, (state, action) => { state.stats = action.payload; state.statsStatus = 'succeeded'; })
      .addCase(fetchStats.rejected, (state, action) => { state.statsStatus = 'failed'; state.error = action.error.message; })
      .addCase(applyJob.pending, (state) => { state.applyStatus = 'loading'; })
      .addCase(applyJob.fulfilled, (state) => { state.applyStatus = 'succeeded'; })
      .addCase(applyJob.rejected, (state, action) => { state.applyStatus = 'failed'; state.error = action.error.message; })
      .addCase(fetchMyApplications.fulfilled, (state, action) => { state.myApplications = action.payload; })
      .addCase(fetchMyApplications.rejected, (state, action) => { state.error = action.error.message; })
      .addCase(fetchApplications.fulfilled, (state, action) => { state.applications = action.payload; })
      .addCase(fetchApplications.rejected, (state, action) => { state.error = action.error.message; })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => { state.applications = state.applications.map((item) => item.id === action.payload.id ? action.payload : item); })
      .addCase(createJob.fulfilled, (state) => { state.page = null; })
      .addCase(updateJob.fulfilled, (state) => { state.page = null; })
      .addCase(deleteJob.fulfilled, (state) => { state.page = null; })
      .addCase(fetchInterviews.fulfilled, (state, action) => { state.interviews = action.payload; })
      .addCase(fetchInterviews.rejected, (state, action) => { state.error = action.error.message; })
      .addCase(scheduleInterview.fulfilled, (state, action) => { state.interviews = [action.payload, ...state.interviews]; })
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.notifications = action.payload; })
      .addCase(fetchNotifications.rejected, (state, action) => { state.error = action.error.message; })
      .addCase(markNotificationRead.fulfilled, (state, action) => { state.notifications = state.notifications.map((item) => item.id === action.payload.id ? action.payload : item); });
  }
});

export const { clearApply } = slice.actions;
export default slice.reducer;
