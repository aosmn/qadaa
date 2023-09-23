import axios from './axiosRequest';

export const getPrayerTimes = async(lat, long, method, day) => {
    const { data } = await axios.get(`/api/prayerTimes/${day? `${day}/` : ''}?latitude=${lat}&longitude=${long}&method=${method}`);
    return data;
};
export const getCalculationMethods = async() => {
    const { data } = await axios.get(`/api/prayerTimes/methods`);
    return data;
};
