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

app.get("/user", (req, res) => {
  res.json(data.user);
});

app.post('/predict', (req, res) => {
  const { userId, gameId, pick, amount } = req.body;
  
  const user = data.user;
  if (!user || user.id !== userId) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

  user.balance -= amount;
  const prediction = {
    id: Date.now().toString(),
    gameId,
    pick,
    amount,
    result: 'pending'
  };
  user.predictions.push(prediction);

  res.json({ success: true, user });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
