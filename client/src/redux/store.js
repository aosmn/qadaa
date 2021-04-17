import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { userReducer, passwordReducer } from './reducers/userReducer';
import {
  prayersReducer,
  prayerTotalsReducer,
  updateLogsReducer
} from './reducers/prayerReducer';

const reducer = combineReducers({
  userInfo: userReducer,
  passwordReset: passwordReducer,
  prayerLogs: prayersReducer,
  prayerTotals: prayerTotalsReducer,
  // updateLogs: updateLogsReducer
});

const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  userInfo: { user: userFromStorage }
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;