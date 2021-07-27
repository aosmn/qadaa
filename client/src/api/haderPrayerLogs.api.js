import axios from './axiosRequest';

export const getLogs = async () => {
  const { data } = await axios.get(`/api/dayPrayers`);
  // console.log('getLogs',data);
  // setLocalStorage
  return data;
};
export const getDayLogs = async day => {
  const { data } = await axios.get(`/api/dayPrayers/day`, { params: { day } });
  // setLocalStorage
  if (data) localStorage.setItem('today-hader', JSON.stringify(data));
  else {
    JSON.parse(localStorage.getItem('today-hader'));
  }
  return data;
};
export const updateLogs = async (day, prayer, done) => {
  const { data } = await axios.post('/api/dayPrayers/', {
    day,
    prayer,
    done
  });
  return data;
};

export const postOfflinePrayers = async (day, prayers) => {
  const { data } = await axios.put('/api/dayPrayers/set', {
    day,
    prayers
  });
  return data;
};
