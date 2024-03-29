import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { userReducer, passwordReducer, joyrideReducer } from './reducers/userReducer';
import {
  prayersReducer,
  prayerTotalsReducer,
  // updateLogsReducer
} from './reducers/prayerReducer';
import {
  haderPrayersReducer
} from './reducers/haderPrayerReducer';

const reducer = combineReducers({
  userInfo: userReducer,
  passwordReset: passwordReducer,
  prayerLogs: prayersReducer,
  haderPrayerLogs: haderPrayersReducer,
  prayerTotals: prayerTotalsReducer,
  joyride: joyrideReducer
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
