import { createSlice } from '@reduxjs/toolkit';
import { setField, resetCalculator } from '../actions/calculatorActions';

const initialState = {
  salary: '',
  region: 'Malaysia',
  workingDays: '',
  wfhDays: '',
  annualLeaves: '',
  medicalLeaves: '',
  publicHolidays: '',
  workingHours: '',
  commuteTime: '',
  restTime: '',
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {}, // No inline reducers, use external actions
  extraReducers: (builder) => {
    builder
      .addCase(setField, (state, action) => {
        const { field, value } = action.payload;
        state[field] = value;
      })
      .addCase(resetCalculator, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export default calculatorSlice.reducer; 