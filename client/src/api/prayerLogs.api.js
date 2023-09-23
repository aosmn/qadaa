import axios from './axiosRequest';

export const getLogs = async () => {
  const { data } = await axios.get(`/api/prayers`);
  return data;
};
export const getDayLogs = async day => {
  const { data } = await axios.get(`/api/prayers/day`, { params: { day } });
  if (data) localStorage.setItem('today', JSON.stringify(data));
  else {
    JSON.parse(localStorage.getItem('today'));
  }
  return data;
};

export const getPrayerTotals = async () => {
  const { data } = await axios.get(`/api/prayers/totals`);
  if (data) localStorage.setItem('totals', JSON.stringify(data));
  else {
    const totalsFromLocalStorage = localStorage.getItem('totals');
    if(totalsFromLocalStorage)
      JSON.parse(totalsFromLocalStorage);
  }
  return data;
};

export const updateLogs = async (day, prayer, count) => {
  const { data } = await axios.post('/api/prayers/', {
    day,
    prayer,
    count
  });
  return data;
};

export const updateLogsAllDay = async (day, count) => {
  const { data } = await axios.post('/api/prayers/all', {
    day,
    count
  });
  return data;
};

export const setLogs = async (day, prayers) => {
  const { data } = await axios.post('/api/prayers/set', {
    day,
    prayers
  });
  return data;
};

export const postOfflinePrayers = async (day, prayers) => {
  const { data } = await axios.put('/api/prayers/set', {
    day,
    prayers
  });
  return data;
};
