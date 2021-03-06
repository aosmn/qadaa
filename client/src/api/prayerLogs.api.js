import axios, { setAxiosAuth } from './axiosRequest';
if (localStorage.getItem('user')) {
  setAxiosAuth('Bearer ' + JSON.parse(localStorage.getItem('user')).token);
}
export const getLogs = async () => {
  const { data } = await axios.get(`/api/prayers`);
  // setLocalStorage
  return data;
};
export const getDayLogs = async (day) => {
  const { data } = await axios.get(`/api/prayers/day`, {params: {day}});
  // setLocalStorage
  return data;
};
export const getPrayerTotals = async id => {
  const { data } = await axios.get(`/api/prayers/totals`);
  // setLocalStorage
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
