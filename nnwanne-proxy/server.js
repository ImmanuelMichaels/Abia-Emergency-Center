require("dotenv").config();
const express = require("express");
const cors = require("cors");
// express-rate-limit loaded conditionally below

const app = express();

// Railway (and most cloud platforms) sit behind a reverse proxy.
// This tells Express to trust the X-Forwarded-For header so
// express-rate-limit can identify real client IPs correctly.
app.set("trust proxy", 1);

// ═══════════════════════════════════════════════════════════════
//  ENVIRONMENT VALIDATION
//  Hard-required: GROQ_API_KEY (core feature, nothing works without it)
//  Soft-required: others — warn loudly but don't crash so Railway
//  still boots while you add the remaining vars in the dashboard.
// ═══════════════════════════════════════════════════════════════
const PORT                = process.env.PORT || 3001;
const GROQ_API_KEY        = process.env.GROQ_API_KEY;
const ELEVENLABS_API_KEY  = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "nw6EIXCsQ89uJMjytYb8"; // fallback to original
const API_SECRET          = process.env.API_SECRET; // shared secret — see .env.example

// Crash only if Groq key is absent — everything else degrades gracefully
if (!GROQ_API_KEY) {
  console.error("❌ FATAL: GROQ_API_KEY is not set. Server cannot start.");
  process.exit(1);
}

// Warn about missing-but-non-fatal vars
const SOFT_VARS = { ELEVENLABS_API_KEY, API_SECRET };
Object.entries(SOFT_VARS).forEach(([key, val]) => {
  if (!val) console.warn(`⚠️  WARNING: ${key} is not set — related features will be disabled.`);
});

console.log("🔑 Groq Key:        ", GROQ_API_KEY       ? "Loaded ✅" : "MISSING ❌");
console.log("🔑 ElevenLabs Key:  ", ELEVENLABS_API_KEY  ? "Loaded ✅" : "MISSING ❌");
console.log("🔑 ElevenLabs Voice:", ELEVENLABS_VOICE_ID ? "Loaded ✅" : "MISSING ❌");
console.log("🔑 API Secret:      ", API_SECRET          ? "Loaded ✅" : "NOT SET ⚠️  (secret enforcement disabled until set)");

// ═══════════════════════════════════════════════════════════════
//  SECURITY HEADERS — helmet is optional
//  Already in your package.json. If not yet installed, server
//  still runs safely; headers kick in after next npm install.
// ═══════════════════════════════════════════════════════════════
try {
  const helmet = require("helmet");
  app.use(helmet());
  app.use(helmet.referrerPolicy({ policy: "strict-origin-when-cross-origin" }));
  console.log("🛡️  Helmet security headers: active ✅");
} catch {
  console.warn("⚠️  helmet not installed — security headers skipped. Run: npm install helmet");
}

// ═══════════════════════════════════════════════════════════════
//  CORS — strict allow-list only
// ═══════════════════════════════════════════════════════════════
const ALLOWED_ORIGINS = [
  "https://abia-emergency-center.vercel.app",
  "https://abia-emergency-center-production.up.railway.app",
];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin only from same-host (e.g. server health check)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error("CORS: origin not allowed"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "x-api-secret"],
}));

// ═══════════════════════════════════════════════════════════════
//  BODY PARSER — hard cap at 50 KB (not 2 MB)
// ═══════════════════════════════════════════════════════════════
app.use(express.json({ limit: "50kb" }));

// ═══════════════════════════════════════════════════════════════
//  RATE LIMITERS — optional, active only if express-rate-limit is installed
// ═══════════════════════════════════════════════════════════════
let globalLimiter = (req, res, next) => next(); // no-op fallback
let aiLimiter     = (req, res, next) => next();
let ttsLimiter    = (req, res, next) => next();

try {
  const rateLimit = require("express-rate-limit");

  globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please slow down." },
  });

  aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "AI rate limit exceeded. Wait 60 seconds and try again." },
  });

  ttsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "TTS rate limit exceeded. Wait 60 seconds and try again." },
  });

  console.log("🚦 Rate limiting: active ✅");
} catch {
  console.warn("⚠️  express-rate-limit not installed — rate limiting skipped. Run: npm install express-rate-limit");
}

app.use(globalLimiter);

// ═══════════════════════════════════════════════════════════════
//  SHARED SECRET MIDDLEWARE
//  All /api/* routes require the x-api-secret header.
//  This blocks curl/Postman abuse even though it isn't a full
//  auth system — combine with rate limiting for defence-in-depth.
// ═══════════════════════════════════════════════════════════════
function requireSecret(req, res, next) {
  // If API_SECRET is not yet configured, skip enforcement but warn loudly.
  // Set it in Railway env vars as soon as possible.
  if (!API_SECRET) {
    console.warn("WARNING: API_SECRET not set — secret check skipped. Set it in Railway env vars!");
    return next();
  }
  const provided = req.headers["x-api-secret"];
  if (!provided || provided !== API_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

// ═══════════════════════════════════════════════════════════════
//  SYSTEM PROMPT — lives ONLY on the server, never sent by client
// ═══════════════════════════════════════════════════════════════
const NNWANNE_SYSTEM = `You are Nnwanne, an intelligent emergency response and navigation assistant for Abia State, Nigeria. You are embedded in the Abia State Emergency Contacts app.

Your name "Nnwanne" means "sibling/fellow" in Igbo — you treat every user like family.

PERSONALITY:
- Warm, calm, and deeply knowledgeable about Abia State
- Mix English with light Igbo phrases naturally (e.g. "Nna/Nne" for dear, "No wahala" for no problem, "Oya" for okay/let's go)
- In emergencies: become laser-focused, brief, action-first
- In normal navigation: friendly, detailed, patient
- Never panic the user unnecessarily

CORE CAPABILITIES:
1. EMERGENCY RESPONSE: Identify emergency type → give immediate action steps → provide relevant contacts
2. NAVIGATION: Give precise directions using Aba and Umuahia street knowledge
3. BUS/KEKE GUIDANCE: Tell users which bus stop to board from, which route, which transport type
4. NEARBY PLACES: Suggest police stations, hotels, petrol stations, food joints, hospitals
5. DANGER ZONE ALERTS: Warn about risky areas in Abia, especially at night
6. GENERAL LOCAL KNOWLEDGE: Schools, markets, landmarks, LGA info

KEY ABIA FACTS:
- Aba is the commercial capital; Umuahia is the political capital
- Emergency: 112 (general), 199 (police), 122 (FRSC)
- NAPTIP South-East: +2348039000004
- NHRC Abia: +2348035403780
- Legal Aid: 0703-000-0000

DANGER ZONE AWARENESS:
- Ariaria Market environs at night → HIGH risk, pickpockets
- Port Harcourt Road bridge → HIGH robbery risk after 8pm
- Aba-Owerri Road at night → HIGH highway robbery risk

RESPONSE STYLE:
- For emergencies: 3 sentences max, action-first
- For directions: step-by-step with landmarks
- For info: conversational, max 150 words
- Always end emergency responses with the most relevant hotline number

MATERNITY & OBSTETRIC EMERGENCIES:
- FMC Umuahia and ABSUTH have full 24hr Obs/Gynae and NICU
- For labour emergencies: tell user to call 112 AND head to nearest hospital with 24hr emergency maternity
- For high-risk pregnancies: FMC Umuahia or ABSUTH are the best options

If user says they are in danger, immediately ask WHERE and give closest police station.
If user mentions pregnancy emergency or labour: ask location → give nearest 24hr maternity hospital → say call 112.

Respond naturally — no bullet points for voice responses, use flowing speech.`;

// ═══════════════════════════════════════════════════════════════
//  INPUT VALIDATORS
// ═══════════════════════════════════════════════════════════════
function validateMessages(messages) {
  if (!Array.isArray(messages)) return false;
  if (messages.length > 20) return false; // hard cap on history depth
  for (const m of messages) {
    if (!m || typeof m !== "object") return false;
    if (!["user", "assistant"].includes(m.role)) return false; // block system role injection
    if (typeof m.content !== "string") return false;
    if (m.content.length > 2000) return false; // per-message char cap
  }
  return true;
}

function validateCoordinates(lat, lng) {
  return (
    typeof lat === "number" && isFinite(lat) && lat >= -90  && lat <= 90 &&
    typeof lng === "number" && isFinite(lng) && lng >= -180 && lng <= 180
  );
}

// Allowed place types — prevent arbitrary values reaching Google API
const ALLOWED_PLACE_TYPES = new Set([
  "lodging", "restaurant", "hospital", "pharmacy",
  "police", "gas_station", "bank", "atm",
]);

// ═══════════════════════════════════════════════════════════════
//  SAFE ERROR HELPER — never leak internals to clients
// ═══════════════════════════════════════════════════════════════
function safeError(res, statusCode, publicMsg, internalErr) {
  if (internalErr) console.error("❌ Internal:", internalErr?.message || internalErr);
  return res.status(statusCode).json({ error: publicMsg });
}

// ═══════════════════════════════════════════════════════════════
//  HEALTH CHECK — public, no secret required
// ═══════════════════════════════════════════════════════════════
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Abia Emergency Server is running ✅" });
});

// ═══════════════════════════════════════════════════════════════
//  CHAT ENDPOINT
// ═══════════════════════════════════════════════════════════════
app.post("/api/chat", requireSecret, aiLimiter, async (req, res) => {
  try {
    const { messages, localContext } = req.body;
    // ── Client sends ONLY messages[] and an optional local context string.
    //    System prompt is always injected server-side.
    //    'model' and 'max_tokens' are always server-controlled.

    if (!validateMessages(messages)) {
      return safeError(res, 400, "Invalid messages payload.");
    }

    // Optional local context (e.g. hotels/places data built on client).
    // We sanitise it: string only, 3000 char cap, strip control chars.
    let contextStr = "";
    if (localContext) {
      if (typeof localContext !== "string") {
        return safeError(res, 400, "Invalid localContext.");
      }
      contextStr = localContext.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").slice(0, 3000);
    }

    const systemContent = NNWANNE_SYSTEM + (contextStr ? `\n\n[LOCAL DATA]\n${contextStr}` : "");

    const formattedMessages = [
      { role: "system", content: systemContent },
      ...messages,
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",   // server-controlled
        messages: formattedMessages,
        max_tokens: 1024,                    // server-controlled, never from client
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Groq API error:", JSON.stringify(data.error));
      return safeError(res, 502, "AI service error. Please try again.", data.error);
    }

    res.json({
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
    });
  } catch (err) {
    safeError(res, 500, "Something went wrong. Please try again.", err);
  }
});

// ═══════════════════════════════════════════════════════════════
//  TTS ENDPOINT
// ═══════════════════════════════════════════════════════════════
app.post("/api/speak", requireSecret, ttsLimiter, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return safeError(res, 400, "No valid text provided.");
    }

    // Strip control chars and hard-cap to 400 chars (free-tier guard)
    const trimmedText = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim()
      .slice(0, 400);

    if (!trimmedText) return safeError(res, 400, "Text was empty after sanitisation.");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: "eleven_turbo_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("❌ ElevenLabs error:", JSON.stringify(err));
      return safeError(res, 502, "TTS service error. Please try again.", err);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.byteLength,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    safeError(res, 500, "Something went wrong. Please try again.", err);
  }
});

// ═══════════════════════════════════════════════════════════════
//  GOOGLE PLACES NEARBY ENDPOINT
// ═══════════════════════════════════════════════════════════════
app.post("/api/places", requireSecret, aiLimiter, async (req, res) => {
  try {
    const { lat, lng, type, keyword } = req.body;

    // Validate coordinates
    if (!validateCoordinates(lat, lng)) {
      return safeError(res, 400, "Invalid or missing coordinates.");
    }

    // Allow-list place types — no arbitrary strings to Google
    if (!type || !ALLOWED_PLACE_TYPES.has(type)) {
      return safeError(res, 400, "Invalid place type.");
    }

    // Sanitise keyword — strip anything that isn't alphanumeric/space/hyphen
    const safeKeyword = typeof keyword === "string"
      ? keyword.replace(/[^a-zA-Z0-9 \-]/g, "").slice(0, 80)
      : "";

    const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;
    if (!GOOGLE_KEY) return safeError(res, 500, "Service temporarily unavailable.");

    const radius = 5000;
    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.set("location", `${lat},${lng}`);
    url.searchParams.set("radius", String(radius));
    url.searchParams.set("type", type);
    if (safeKeyword) url.searchParams.set("keyword", safeKeyword);
    url.searchParams.set("key", GOOGLE_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("❌ Google Places error:", data.status, data.error_message);
      return safeError(res, 502, "Location service error. Please try again.", data.error_message);
    }

    const places = (data.results || []).slice(0, 5).map(p => ({
      name: p.name,
      address: p.vicinity,
      rating: p.rating || null,
      open_now: p.opening_hours?.open_now ?? null,
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng,
      place_id: p.place_id,
    }));

    res.json({ places, status: data.status });
  } catch (err) {
    safeError(res, 500, "Something went wrong. Please try again.", err);
  }
});

// ═══════════════════════════════════════════════════════════════
//  404 CATCH-ALL
// ═══════════════════════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ═══════════════════════════════════════════════════════════════
//  GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════════════════════════
app.use((err, req, res, _next) => {
  console.error("❌ Unhandled error:", err.message);
  res.status(500).json({ error: "An internal error occurred." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Hardened server running on port ${PORT}`);
});
