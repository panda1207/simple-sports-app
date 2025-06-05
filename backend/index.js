const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const data = require("./data/sample-games-simplified.json");

app.use(cors());
app.use(express.json());

app.get("/games", (req, res) => {
  res.json(data.games);
});

app.get("/games/:id", (req, res) => {
  const gameId = req.params.id;
  const game = data.games.find(g => g.id === gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

app.get("/user", (req, res) => {
  res.json(data.user);
});

app.post('/predict', (req, res) => {
  const { userId, gameId, pick, amount, result } = req.body;
  
  const user = data.user;
  if (!user || user.id !== userId) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

  user.balance -= amount;

  res.json({ success: true, message: 'Prediction placed successfully', user });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
