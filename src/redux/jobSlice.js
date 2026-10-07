import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.message || body?.error || 'Request failed')
  return body
}

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params = {}) => {
  const query = new URLSearchParams({
    q: params.q || '',
    location: params.location || '',
    type: params.type || '',
    page: String(params.page ?? 0),
    size: String(params.size ?? 6),
    sortBy: params.sortBy || 'id',
    direction: params.direction || 'desc',
  })
  return request(`${API_URL}/jobs?${query.toString()}`)
})

export const fetchStats = createAsyncThunk('jobs/fetchStats', () =>
  request(`${API_URL}/jobs/stats`)
)

export const applyToJob = createAsyncThunk('jobs/apply', (id) =>
  request(`${API_URL}/jobs/${id}/apply`, { method: 'POST' })
)

const initialState = {
  page: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 6 },
  stats: { totalJobs: 0, fullTimeJobs: 0, internshipJobs: 0, remoteJobs: 0 },
  status: 'idle',
  statsStatus: 'idle',
  applyStatus: 'idle',
  appliedJobId: null,
  error: null,
}

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearApplicationMessage: (state) => {
      state.appliedJobId = null
      state.applyStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.page = action.payload
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Unable to load jobs'
      })
      .addCase(fetchStats.pending, (state) => {
        state.statsStatus = 'loading'
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded'
        state.stats = action.payload
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.statsStatus = 'failed'
        state.error = action.error.message || 'Unable to load statistics'
      })
      .addCase(applyToJob.pending, (state) => {
        state.applyStatus = 'loading'
        state.error = null
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.applyStatus = 'succeeded'
        state.appliedJobId = action.payload.jobId
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.applyStatus = 'failed'
        state.error = action.error.message || 'Application failed'
      })
  },
})

export const { clearApplicationMessage } = jobSlice.actions
export default jobSlice.reducer
