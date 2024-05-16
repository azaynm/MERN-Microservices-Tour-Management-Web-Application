// menuSlice.js

import { createSlice } from '@reduxjs/toolkit';
const ActivitySlice = createSlice({
  name: 'activities',
  initialState: {
    backend: "http://localhost:4000",
    activities: [],
  },
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload;
    }
  },
});

export const { setActivities } = ActivitySlice.actions;


export default ActivitySlice.reducer;
