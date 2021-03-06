// import axios from 'axios';
import {
  GET_LOGS_REQUEST,
  GET_LOGS_SUCCESS,
  GET_LOGS_FAIL,
  GET_PRAYER_TOTALS_REQUEST,
  GET_PRAYER_TOTALS_SUCCESS,
  GET_PRAYER_TOTALS_FAIL,
  DAY_UPDATE_REQUEST,
  DAY_UPDATE_SUCCESS,
  DAY_UPDATE_FAIL,
  GET_DAY_LOGS_REQUEST,
  GET_DAY_LOGS_SUCCESS,
  GET_DAY_LOGS_FAIL
} from '../actionTypes/prayerActionTypes.js';

import {
  getLogs as fetchLogs,
  getDayLogs as fetchDayLogs,
  getPrayerTotals as fetchTotals,
  updateLogs,
  updateLogsAllDay
} from '../../api/prayerLogs.api';

export const getLogs = id => async dispatch => {
  try {
    dispatch({
      type: GET_LOGS_REQUEST
    });

    const { prayers } = await fetchLogs();
    dispatch({
      type: GET_LOGS_SUCCESS,
      payload: prayers
    });
  } catch (error) {
    dispatch({
      type: GET_LOGS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const getDayLogs = (day=new Date()) => async dispatch => {
  try {
    dispatch({
      type: GET_DAY_LOGS_REQUEST
    });

    const data = await fetchDayLogs(day);
    dispatch({
      type: GET_DAY_LOGS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GET_DAY_LOGS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const getPrayerTotals = id => async dispatch => {
  try {
    dispatch({
      type: GET_PRAYER_TOTALS_REQUEST
    });

    const data = await fetchTotals(id);

    dispatch({
      type: GET_PRAYER_TOTALS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GET_PRAYER_TOTALS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const updateDayLogs = ({ day, prayer, count }) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: DAY_UPDATE_REQUEST
    });

    const {
      userInfo: { user }
    } = getState();
    let data;
    if (prayer === 'all') {
      data = await updateLogsAllDay(day, count);
    } else {
      data = await updateLogs(day, prayer, count);
    }
    dispatch(getDayLogs());
    dispatch({
      type: DAY_UPDATE_SUCCESS,
      payload: data
    });
    const totals = await fetchTotals(user._id);
    // console.log('totals',totals);
    dispatch({
      type: GET_PRAYER_TOTALS_SUCCESS,
      payload: totals
    });
  } catch (error) {
    dispatch({
      type: DAY_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};
