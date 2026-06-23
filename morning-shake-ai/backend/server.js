const fs = require("fs");
const path = require("path");
const express = require("express");

loadEnvFile();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.use(express.json());


function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

const nutritionAssistantInstruction = `
You are Morning Protein Shake AI, a certified nutrition assistant focused on healthy morning protein shakes.
Your job is to suggest protein shake recipes, explain ingredient benefits, estimate calories and protein,
and suggest alternatives for muscle gain, weight loss, and general health.
Ask concise follow-up questions when the user's goals, allergies, diet preferences, or medical constraints are unclear.
Avoid dangerous medical advice. Do not diagnose, treat, or replace a clinician. Encourage users with medical conditions,
pregnancy, allergies, eating disorders, kidney disease, or medication concerns to consult a qualified healthcare professional.
Keep answers practical, friendly, and beginner-friendly.
`;

app.get("/", (req, res) => {
  res.json({
    message: "Morning Protein Shake AI backend is running.",
    endpoint: "POST /ask-ai"
  });
});

app.post("/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Please provide a question in the prompt field." });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Gemini API key is missing. Add GEMINI_API_KEY to backend/.env."
    });
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: nutritionAssistantInstruction }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 900
          }
        })
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      const message = data.error?.message || "Gemini API request failed.";
      return res.status(geminiResponse.status).json({ error: message });
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!answer) {
      return res.status(502).json({ error: "Gemini returned an empty response." });
    }

    res.json({ answer });
  } catch (error) {
    console.error("Gemini request error:", error);
    res.status(500).json({ error: "Unable to generate an AI response right now." });
  }
});

app.listen(PORT, () => {
  console.log(`Morning Protein Shake AI backend running at http://localhost:${PORT}`);
});
