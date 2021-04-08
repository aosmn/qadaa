// import axios from 'axios';
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
  USER_PREFERENCES_UPDATE_FAIL
} from '../actionTypes/userActionTypes.js';
import { setAxiosAuth } from '../../api/axiosRequest';

import {
  login as loginRequest,
  register as registerRequest,
  updateUser,
  sendPasswordRecoverEmail,
  resetPassword as resetPasswordRequest,
  updatePrefs
} from '../../api/user.api';

if (localStorage.getItem('user')) {
  setAxiosAuth('Bearer ' + JSON.parse(localStorage.getItem('user')).token);
}

export const login = (email, password) => async dispatch => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST
    });

    const data = await loginRequest({ email, password });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const logout = () => dispatch => {
  localStorage.removeItem('user');
  dispatch({ type: USER_LOGOUT });
};

export const register = (name, email, password) => async dispatch => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST
    });

    const data = await registerRequest({ name, email, password });

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data
    });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const updateUserProfile = user => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST
    });

    // const {
    //   userInfo: { user }
    // } = getState();

    const data = await updateUser(user);

    dispatch({
      type: USER_UPDATE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const updateUserPreferences = prefs => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_PREFERENCES_UPDATE_REQUEST
    });

    const {
      userInfo: { user }
    } = getState();

    const { preferences } = await updatePrefs({
      token: user.token,
      preferences: prefs
    });

    dispatch({
      type: USER_PREFERENCES_UPDATE_SUCCESS,
      payload: preferences
    });
  } catch (error) {
    console.log('error', error);
    dispatch({
      type: USER_PREFERENCES_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const registerFail = error => async dispatch => {
  dispatch({
    type: USER_REGISTER_FAIL,
    payload: error
  });
};

export const sendRecoverEmail = email => async dispatch => {
  try {
    dispatch({
      type: PASSWORD_RESET_REQUEST
    });

    const data = await sendPasswordRecoverEmail(email);

    dispatch({
      type: PASSWORD_RESET_SUCCESS,
      payload: data.message
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const resetPassword = (token, email, password) => async dispatch => {
  try {
    dispatch({
      type: PASSWORD_RESET_REQUEST
    });

    const data = await resetPasswordRequest({ token, email, password });

    dispatch({
      type: PASSWORD_RESET_SUCCESS,
      payload: data.message
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const clearPasswordState = () => async dispatch => {
  dispatch({
    type: CLEAR_PASSWORD_STATE
  });
};
