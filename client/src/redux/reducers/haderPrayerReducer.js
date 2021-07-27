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
  HADER_DAY_SET_SUCCESS,
  HADER_DAY_SET_REQUEST,
  HADER_DAY_SET_FAIL
} from '../actionTypes/haderPrayerActionTypes.js';

import { USER_LOGOUT } from '../actionTypes/userActionTypes';

const initialState = {
  prayers: [],
  error: '',
  loading: false,
  updateError: '',
  updateLoading: false,
  today: {},
  loadingToday: false,
  todayError: '',
  day: {},
  loadingDay: false,
  dayError: ''
};
export const haderPrayersReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGOUT:
      return initialState;
    case GET_HADER_LOGS_REQUEST:
      return { ...state, loading: true };
    case GET_HADER_LOGS_SUCCESS:
      return { ...state, loading: false, prayers: action.payload };
    case GET_HADER_LOGS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case HADER_DAY_UPDATE_REQUEST:
      return { ...state, updateError: null, updateLoading: true };
    case HADER_DAY_UPDATE_SUCCESS:
      console.log(action.payload);
      let nwPrayers = state.prayers;
      if (!state.prayers.find(d => d.day === action.payload.day)) {
        nwPrayers.push(action.payload);
      } else {
        nwPrayers = state.prayers.map(d => {
          return d.day === action.payload.day ? action.payload : d
        }
        );
      }
      return {
        ...state,
        updateLoading: false,
        success: true,
        day: action.payload,
        prayers: nwPrayers
      };
    case HADER_DAY_UPDATE_FAIL:
      return { ...state, updateLoading: false, updateError: action.payload };
    case GET_HADER_TODAY_LOGS_REQUEST:
      return { ...state, loadingToday: true, todayError: '' };
    case GET_HADER_TODAY_LOGS_SUCCESS:
      return {
        ...state,
        loadingToday: false,
        todayError: '',
        today: action.payload
      };
    case GET_HADER_TODAY_LOGS_FAIL:
      return {
        ...state,
        loadingToday: false,
        todayError: action.payload,
        today: JSON.parse(localStorage.getItem('today-hader')) || {}
      };

    case GET_HADER_DAY_LOGS_REQUEST:
      return { ...state, loadingDay: true, dayError: '' };
    case GET_HADER_DAY_LOGS_SUCCESS:
      return {
        ...state,
        loadingDay: false,
        dayError: '',
        day: action.payload
      };
    case GET_HADER_DAY_LOGS_FAIL:
      return {
        ...state,
        loadingDay: false,
        dayError: action.payload,
        day: JSON.parse(localStorage.getItem('today-hader')) || {}
      };
    case HADER_DAY_SET_SUCCESS:
      let newPrayers = state.prayers;
      if (!state.prayers.find(d => d.day === action.payload.day)) {
        newPrayers.push(action.payload);
      } else {
        newPrayers = state.prayers.map(d =>
          d.day === action.payload.day ? action.payload : d
        );
      }
      // console.log(newPrayers);
      return { ...state, loading: false, success: true, prayers: newPrayers };

    case HADER_DAY_SET_REQUEST:
      return { ...state, loading: true };
    case HADER_DAY_SET_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
