// ============================================================
// Netlify Function — Gemini proxy (serverless)
// Mirrors server/proxy.js but as a Netlify Function handler
// ============================================================

import { GoogleGenAI } from '@google/genai';

// -------- Helpers --------
function extractJSON(text) {
  if (!text) return null;
  let cleaned = String(text).trim();

  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    } catch (_) {}
  }
  return null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callGeminiWithRetry(ai, prompt, maxRetries = 3) {
  const delays = [1000, 2500, 5000];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      });
      return { ok: true, text: response.text };
    } catch (err) {
      const message = err?.message || '';
      const isOverloaded =
        message.includes('503') ||
        message.includes('UNAVAILABLE') ||
        message.includes('high demand');

      if (isOverloaded && attempt < maxRetries) {
        await sleep(delays[attempt] || 5000);
        continue;
      }
      return { ok: false, error: err };
    }
  }
  return { ok: false, error: new Error('Max retries exceeded') };
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

// -------- Handler --------
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { prompt } = body;
  if (!prompt || typeof prompt !== 'string') {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Missing or invalid prompt' }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: 'Server is missing GEMINI_API_KEY.',
      }),
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await callGeminiWithRetry(ai, prompt);

    if (!result.ok) {
      const message = result.error?.message || 'Unknown error';

      if (
        message.includes('503') ||
        message.includes('UNAVAILABLE') ||
        message.includes('high demand')
      ) {
        return {
          statusCode: 503,
          headers: corsHeaders(),
          body: JSON.stringify({
            error:
              'Google\u2019s AI servers are busy right now. Please wait a few seconds and try again.',
          }),
        };
      }

      if (message.includes('429') || message.toLowerCase().includes('quota')) {
        return {
          statusCode: 429,
          headers: corsHeaders(),
          body: JSON.stringify({
            error: 'Rate limit reached. Please wait a minute and try again.',
          }),
        };
      }

      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({ error: message }),
      };
    }

    const plan = extractJSON(result.text);
    if (!plan) {
      return {
        statusCode: 500,
        headers: corsHeaders(),
        body: JSON.stringify({
          error: 'AI returned malformed output. Please try again.',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ plan }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err?.message || 'Unknown error' }),
    };
  }
};