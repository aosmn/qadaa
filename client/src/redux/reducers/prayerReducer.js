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
  DAY_SET_REQUEST,
  DAY_SET_SUCCESS,
  DAY_SET_FAIL,
  GET_DAY_LOGS_REQUEST,
  GET_DAY_LOGS_SUCCESS,
  GET_DAY_LOGS_FAIL
} from '../actionTypes/prayerActionTypes.js';

export const prayersReducer = (
  state = {
    prayers: [],
    error: '',
    loading: false,
    updateError: '',
    updateLoading: false,
    today: {},
    loadingToday: false,
    todayError: ''
  },
  action
) => {
  switch (action.type) {
    case GET_LOGS_REQUEST:
      return { ...state, loading: true };
    case GET_LOGS_SUCCESS:
      return { ...state, loading: false, prayers: action.payload };
    case GET_LOGS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case DAY_UPDATE_REQUEST:
      return { ...state, updateError: null, updateLoading: true };
    case DAY_UPDATE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        success: true,
        prayers: action.payload
      };
    case DAY_UPDATE_FAIL:
      return { ...state, updateLoading: false, updateError: action.payload };
    case GET_DAY_LOGS_REQUEST:
      return { ...state, loadingToday: true, todayError: '' };
    case GET_DAY_LOGS_SUCCESS:
      return {
        ...state,
        loadingToday: false,
        todayError: '',
        today: action.payload
      };
    case GET_DAY_LOGS_FAIL:
      return {
        ...state,
        loadingToday: false,
        todayError: action.payload,
        today: JSON.parse(localStorage.getItem('today')) || {}
      };

    case DAY_SET_REQUEST:
      return { ...state, loading: true };
    case DAY_SET_SUCCESS:
      let newPrayers = state.prayers;
      if (!state.prayers.find(d => d.day === action.payload.day)) {
        newPrayers.push(action.payload);
      } else {
        newPrayers = state.prayers.map(d =>
          d.day === action.payload.day ? action.payload : d
        );
      }

      return { ...state, loading: false, success: true, prayers: newPrayers };
    case DAY_SET_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const prayerTotalsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_PRAYER_TOTALS_REQUEST:
      return { ...state, loading: true };
    case GET_PRAYER_TOTALS_SUCCESS:
      return { ...state, loading: false, totals: action.payload };
    case GET_PRAYER_TOTALS_FAIL:
    console.log('data', JSON.parse(localStorage.getItem('totals')));
      return { ...state, loading: false, error: action.payload,  totals: JSON.parse(localStorage.getItem('totals'))};
    default:
      return state;
  }
};

// export const updateLogsReducer = (state = {}, action) => {
//   switch (action.type) {
//     case DAY_UPDATE_REQUEST:
//       return { loading: true };
//     case DAY_UPDATE_SUCCESS:
//       return { loading: false, success: true, logs: action.payload };
//     case DAY_UPDATE_FAIL:
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };
