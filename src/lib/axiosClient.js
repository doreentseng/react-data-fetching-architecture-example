import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.example.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10 * 1000,
});

axiosClient.interceptors.request.use(
  async (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axiosClient;