import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || 'Request failed')
  }
  return response.status === 204 ? null : response.json()
}

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', () =>
  request(`${API_URL}/employees`),
)

export const addEmployee = createAsyncThunk('employees/addEmployee', (employee) =>
  request(`${API_URL}/employees`, {
    method: 'POST',
    body: JSON.stringify(employee),
  }),
)

export const updateEmployee = createAsyncThunk('employees/updateEmployee', ({ id, employee }) =>
  request(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employee),
  }),
)

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', (id) =>
  request(`${API_URL}/employees/${id}`, { method: 'DELETE' }).then(() => id),
)

const employeeSlice = createSlice({
  name: 'employees',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchEmployees.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload })
      .addCase(fetchEmployees.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })
      .addCase(addEmployee.fulfilled, (state, action) => { state.items.push(action.payload) })
      .addCase(addEmployee.rejected, (state, action) => { state.error = action.error.message })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(updateEmployee.rejected, (state, action) => { state.error = action.error.message })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteEmployee.rejected, (state, action) => { state.error = action.error.message })
  },
})

export default employeeSlice.reducer
