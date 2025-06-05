import axios from 'axios';
const BASE_URL = 'http://localhost:3001';

export const getGames = async () => {
  const res = await axios.get(`${BASE_URL}/games`);
  return res.data;
};

export const getGame = async (gameId: string) => {
  const res = await axios.get(`${BASE_URL}/games/${gameId}`);
  return res.data;
};

export const getUser = async () => {
  const res = await axios.get(`${BASE_URL}/user`);
  return res.data;
};

export const submitPrediction = async (userId: string, prediction: any, pick: string, p0: number) => {
  const body = {
    userId,
    prediction,
    pick,
    amount: p0
  };
  const res = await axios.post(`${BASE_URL}/predict`, body);
  return res.data;
};