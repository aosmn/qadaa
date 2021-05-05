import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  CLEAR_PASSWORD_STATE,
  USER_PREFERENCES_UPDATE_REQUEST,
  USER_PREFERENCES_UPDATE_SUCCESS,
  USER_PREFERENCES_UPDATE_FAIL,
  SET_JOYRIDE_NEXT,
  USER_ME_REQUEST,
  USER_ME_SUCCESS,
  USER_ME_FAIL
} from '../actionTypes/userActionTypes';

export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { ...state, loading: true };
    case USER_REGISTER_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case USER_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };
    case USER_ME_REQUEST:
      return { ...state, loading: true };
    case USER_ME_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case USER_ME_FAIL:
      return { ...state, loading: false, error: action.payload, user: JSON.parse(localStorage.getItem('user')) };
    case USER_LOGOUT:
      return {};
    case USER_UPDATE_REQUEST:
      return { ...state, loading: true };
    case USER_UPDATE_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case USER_UPDATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case USER_PREFERENCES_UPDATE_REQUEST:
      return { ...state, loading: true };
    case USER_PREFERENCES_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: { ...state.user, preferences: action.payload }
      };
    case USER_PREFERENCES_UPDATE_FAIL:
      return { ...state, loading: false, error: action.payload, user: JSON.parse(localStorage.getItem('user')) };
    default:
      return state;
  }
};

export const passwordReducer = (state = {}, action) => {
  switch (action.type) {
    case PASSWORD_RESET_REQUEST:
      return { loading: true };
    case PASSWORD_RESET_SUCCESS:
      return { loading: false, message: action.payload };
    case PASSWORD_RESET_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_PASSWORD_STATE:
      return {};
    default:
      return state;
  }
};

export const joyrideReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_JOYRIDE_NEXT:
      return { next: action.payload };
    default:
      return state;
  }
};
