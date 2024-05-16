import Swal from 'sweetalert2';

import axios from 'axios';
import { setActivities } from '../slices/ActivitySlice';

export const fetchActivities = () => {
    return async (dispatch, getState) => {
  
      try {
        const { backend } = getState().activities;
        const response = await axios.get(`${backend}/activity/`);
        const activities = response.data;
        console.log(activities)
        dispatch(setActivities(activities));
      } catch (error) {
        console.log(error)
      }
    };
  };