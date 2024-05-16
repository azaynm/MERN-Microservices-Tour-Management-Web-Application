// store.js
import { configureStore } from '@reduxjs/toolkit';
import activityReducer from './Activitiy/slices/ActivitySlice';

const store = configureStore({
  reducer: {
    activities: activityReducer,
  },
});

export default store;
