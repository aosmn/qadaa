import axios from 'axios';

const request = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL
});
request.defaults.headers.common['Content-Type'] = 'application/json';

export const setAxiosAuth = (token) => {
  request.defaults.headers.common['Authorization'] = token;
}
export default request;
