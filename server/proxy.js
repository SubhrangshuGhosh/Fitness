// ============================================================
// Athlos — Local Gemini Proxy
// Runs alongside Vite during development.
// Keeps the API key server-side so it never hits the browser.
// ============================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ============================================================
// Helper — Extract JSON from Gemini's response
// Handles: plain JSON, ```json fences, or JSON with extra text
// ============================================================
function extractJSON(text) {
  if (!text) return null;

  let cleaned = String(text).trim();

  // 1) Strip ```json ... ``` or ``` ... ``` fences
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  // 2) Try parsing as-is
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // continue
  }

  // 3) Fallback: grab everything from the first { to the last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const slice = cleaned.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(slice);
    } catch (_) {
      // continue
    }
  }

  return null;
}

// ============================================================
// POST /api/generate
// ============================================================
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'Server is missing GEMINI_API_KEY. Check your .env file.',
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    const text = response.text || '';
    const plan = extractJSON(text);

    if (!plan) {
      console.error('❌ Could not parse JSON. Raw output (first 800 chars):');
      console.error(text.slice(0, 800));
      return res.status(500).json({
        error:
          'AI returned malformed output. Please try again — or check the server logs for the raw response.',
      });
    }

    res.json({ plan });
  } catch (err) {
    console.error('Gemini error:', err);
    const message = err?.message || 'Unknown error';

    if (message.includes('429') || message.toLowerCase().includes('quota')) {
      return res.status(429).json({
        error: 'Rate limit reached. Please wait a minute and try again.',
      });
    }
    if (message.includes('401') || message.includes('API key')) {
      return res.status(401).json({
        error: 'Invalid API key. Check your .env file.',
      });
    }

    res.status(500).json({ error: message });
  }
});

// ============================================================
// GET /api/health
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.5-flash-lite',
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Athlos proxy running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});