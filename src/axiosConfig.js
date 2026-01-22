// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://new-education-era-backend.onrender.com', // Backend URL
  withCredentials: true, // Allow sending cookies with requests
});

export default axiosInstance;
