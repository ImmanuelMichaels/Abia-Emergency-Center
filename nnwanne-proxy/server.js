require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "https://abia-emergency-center.vercel.app/" }));
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Nnwanne proxy running on port ${PORT}`);
});