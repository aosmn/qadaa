import axios, { setAxiosAuth } from './axiosRequest';

export const register = async user => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const { data } = await axios.post('/api/users', user, config);
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  } else {
    return JSON.parse(localStorage.getItem('user'));
  }
  return data;
};

export const login = async user => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const { data } = await axios.post('/api/users/login', user, config);
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
    setAxiosAuth('Bearer ' + data.token);
  } else {
    return JSON.parse(localStorage.getItem('user'));
  }
  return data;
};

export const getMe = async user => {
  const { data } = await axios.get('/api/users/me');
  if (data) localStorage.setItem('user', JSON.stringify(data));
  else {
    return JSON.parse(localStorage.getItem('user'));
  }
  // setAxiosAuth('Bearer ' + data.token)
  return data;
};

export const updateUser = async user => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`
    }
  };
  const { data } = await axios.put(`/api/users`, user, config);
  if (data) localStorage.setItem('user', JSON.stringify(data));
  else {
    return JSON.parse(localStorage.getItem('user'));
  }
  return data;
};
// updateUserPrefs({token: user.token, preferences: prefs});
export const updatePrefs = async ({ token, preferences }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };
  const { data } = await axios.put(`/api/users/prefs`, preferences, config);
  if (data)
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...JSON.parse(localStorage.getItem('user')),
        preferences: data.preferences
      })
    );
  else {
    return JSON.parse(localStorage.getItem('user'));
  }
  return data;
};

export const sendPasswordRecoverEmail = async email => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const { data } = await axios.post('/api/users/recover', { email }, config);
  return data;
};

export const resetPassword = async user => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const { data } = await axios.post('/api/users/reset', user, config);
  return data;
};
