import axios from './axiosRequest';

export const getFatwas = async (lan) => {
  const { data } = await axios.get(`/api/fatwas?lan=${lan}`);
  return data;
};
