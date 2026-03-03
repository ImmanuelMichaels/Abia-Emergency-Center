require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Allow both Vercel frontend and Railway health checks
app.use(cors({
  origin: [
    "https://abia-emergency-center.vercel.app",
    "https://abia-emergency-center-production.up.railway.app"
  ]
}));
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 3001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
console.log("🔑 Groq Key loaded:", GROQ_API_KEY ? "YES ✅" : "MISSING ❌");

// Health check route — Railway uses this to confirm server is alive
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Abia Emergency Server is running ✅" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, system, max_tokens } = req.body;

    const formattedMessages = [];
    if (system) formattedMessages.push({ role: "system", content: system });
    if (messages && Array.isArray(messages)) formattedMessages.push(...messages);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        max_tokens: max_tokens || 1024,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Groq API error:", JSON.stringify(data.error));
      return res.status(400).json({ error: data.error });
    }

    const anthropicStyleResponse = {
      id: data.id,
      type: "message",
      role: "assistant",
      content: [{ type: "text", text: data.choices?.[0]?.message?.content || "" }],
      model: data.model,
      stop_reason: data.choices?.[0]?.finish_reason || "end_turn",
      usage: {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0,
      },
    };

    res.json(anthropicStyleResponse);
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT} using Groq (Free)`);
});