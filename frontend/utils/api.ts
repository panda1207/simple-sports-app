import axios from 'axios';
const BASE_URL = 'http://localhost:3001';

export const getGames = async () => {
  const res = await axios.get(`${BASE_URL}/games`);
  return res.data;
};

export const getUser = async () => {
  const res = await axios.get(`${BASE_URL}/user`);
  return res.data;
};

export const submitPrediction = async (prediction: any) => {
  const res = await axios.post(`${BASE_URL}/predict`, prediction);
  return res.data;
};