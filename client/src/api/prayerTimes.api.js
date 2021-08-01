import axios from './axiosRequest';

export const getPrayerTimes = async(lat, long, method, day) => {
    const { data } = await axios.get(`/api/prayerTimes/${day? `${day}/` : ''}?latitude=${lat}&longitude=${long}&method=${method}`);
    return data;
};
export const getCalculationMethods = async(lat, long, method) => {
    const { data } = await axios.get(`/api/prayerTimes/methods`);
    return data;
};
// export const getDayLogs = async day => {
//   const { data } = await axios.get(`/api/prayers/day`, { params: { day } });
//   // setLocalStorage
//   if (data) localStorage.setItem('today', JSON.stringify(data));
//   else {
//     JSON.parse(localStorage.getItem('today'));
//   }
//   return data;
// };
// export const getPrayerTotals = async id => {
//   const { data } = await axios.get(`/api/prayers/totals`);
//   // console.log('getPrayerTotals', data);
//   // setLocalStorage
//   // console.log('getPrayersTotals',data);
//   if (data) localStorage.setItem('totals', JSON.stringify(data));
//   else {
//     // console.log('hena', JSON.parse(localStorage.getItem('totals')));
//     JSON.parse(localStorage.getItem('totals'));
//   }
//   return data;
// };
// export const updateLogs = async (day, prayer, count) => {
//   const { data } = await axios.post('/api/prayers/', {
//     day,
//     prayer,
//     count
//   });
//   return data;
// };

// export const updateLogsAllDay = async (day, count) => {
//   const { data } = await axios.post('/api/prayers/all', {
//     day,
//     count
//   });
//   return data;
// };

// export const setLogs = async (day, prayers) => {
//   const { data } = await axios.post('/api/prayers/set', {
//     day,
//     prayers
//   });
//   return data;
// };

// export const postOfflinePrayers = async (day, prayers) => {
//   const { data } = await axios.put('/api/prayers/set', {
//     day,
//     prayers
//   });
//   return data;
// };
