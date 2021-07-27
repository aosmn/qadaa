// import axios from 'axios';
import {
  GET_HADER_LOGS_REQUEST,
  GET_HADER_LOGS_SUCCESS,
  GET_HADER_LOGS_FAIL,
  HADER_DAY_UPDATE_REQUEST,
  HADER_DAY_UPDATE_SUCCESS,
  HADER_DAY_UPDATE_FAIL,
  GET_HADER_DAY_LOGS_REQUEST,
  GET_HADER_DAY_LOGS_SUCCESS,
  GET_HADER_DAY_LOGS_FAIL,
  GET_HADER_TODAY_LOGS_REQUEST,
  GET_HADER_TODAY_LOGS_SUCCESS,
  GET_HADER_TODAY_LOGS_FAIL,
  HADER_DAY_SET_REQUEST,
  HADER_DAY_SET_SUCCESS,
  HADER_DAY_SET_FAIL
} from '../actionTypes/haderPrayerActionTypes.js';

import {
  getLogs as fetchLogs,
  getDayLogs as fetchDayLogs,
  updateLogs,
  postOfflinePrayers
} from '../../api/haderPrayerLogs.api';
import { setAxiosAuth } from '../../api/axiosRequest';

import { logHaderPrayersOffline } from '../../services/DBHelper';

if (localStorage.getItem('user')) {
  setAxiosAuth('Bearer ' + JSON.parse(localStorage.getItem('user')).token);
}

export const getLogs = id => async dispatch => {
  try {
    dispatch({
      type: GET_HADER_LOGS_REQUEST
    });

    const { prayers } = await fetchLogs();
    dispatch({
      type: GET_HADER_LOGS_SUCCESS,
      payload: prayers
    });
  } catch (error) {
    dispatch({
      type: GET_HADER_LOGS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const getDayLogs = day => async dispatch => {
  if (day) {
    try {
      dispatch({
        type: GET_HADER_DAY_LOGS_REQUEST
      });

      const data = await fetchDayLogs(day);
      dispatch({
        type: GET_HADER_DAY_LOGS_SUCCESS,
        payload: data
      });
    } catch (error) {
      dispatch({
        type: GET_HADER_DAY_LOGS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
      });
    }
  } else {
    day = new Date();
    try {
      dispatch({
        type: GET_HADER_TODAY_LOGS_REQUEST
      });

      const data = await fetchDayLogs(day);
      dispatch({
        type: GET_HADER_TODAY_LOGS_SUCCESS,
        payload: data
      });
    } catch (error) {
      dispatch({
        type: GET_HADER_TODAY_LOGS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
      });
    }
  }
};

export const updateDayLogs =
  ({ day, prayer, done }) =>
  async (dispatch, getState) => {
    const {
      userInfo: { user }
    } = getState();
    try {
      dispatch({
        type: HADER_DAY_UPDATE_REQUEST
      });

      let data = await updateLogs(day, prayer, done);
      dispatch(getDayLogs());
      dispatch({
        type: HADER_DAY_UPDATE_SUCCESS,
        payload: data
      });
    } catch (error) {
      logHaderPrayersOffline({ prayer, done, day, user: user._id });
      dispatch({
        type: HADER_DAY_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
      });
    }
  };

export const saveHaderOfflineLogs =
  ({ day, prayers }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: HADER_DAY_SET_REQUEST
      });

      let data;
      data = await postOfflinePrayers(day, prayers);
      // dispatch(getPrayerTotals());
      dispatch({
        type: HADER_DAY_SET_SUCCESS,
        payload: data
      });
      return data;
    } catch (error) {
      dispatch({
        type: HADER_DAY_SET_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
      });
    }
  };
