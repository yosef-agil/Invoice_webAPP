import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getTest = () => {
  return axios.get(`${API_URL}/test`);
};
