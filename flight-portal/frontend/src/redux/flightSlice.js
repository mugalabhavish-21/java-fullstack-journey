import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const request = async (url) => {
  const response = await fetch(url);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || 'Request failed');
  return body;
};
export const fetchCities = createAsyncThunk('flights/fetchCities', () => request(API + '/cities'));
export const searchFlights = createAsyncThunk('flights/searchFlights', ({source,destination}) =>
  request(API + '/flights?source=' + encodeURIComponent(source) + '&destination=' + encodeURIComponent(destination))
);
const slice = createSlice({
  name:'flights',
  initialState:{cities:[],results:[],status:'idle',error:null},
  reducers:{clearResults:(state)=>{state.results=[];state.error=null;}},
  extraReducers:(builder)=>{
    builder
      .addCase(fetchCities.fulfilled,(state,action)=>{state.cities=action.payload;})
      .addCase(fetchCities.rejected,(state,action)=>{state.error=action.error.message;})
      .addCase(searchFlights.pending,(state)=>{state.status='loading';state.error=null;})
      .addCase(searchFlights.fulfilled,(state,action)=>{state.status='succeeded';state.results=action.payload;})
      .addCase(searchFlights.rejected,(state,action)=>{state.status='failed';state.error=action.error.message;state.results=[];});
  }
});
export const {clearResults}=slice.actions;
export default slice.reducer;