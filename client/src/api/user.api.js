import axios from './axiosRequest';

export const register = async user => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const { data } = await axios.post('/api/users', user, config);
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const login = async user => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const { data } = await axios.post('/api/users/login', user, config);
  localStorage.setItem('user', JSON.stringify(data));
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
  localStorage.setItem('user', JSON.stringify(data));
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
