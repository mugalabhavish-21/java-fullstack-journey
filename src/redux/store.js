import { configureStore } from '@reduxjs/toolkit'
import employeesReducer from './employeeSlice'

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
  },
})
