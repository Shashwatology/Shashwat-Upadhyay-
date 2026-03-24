/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// ── Security: CORS whitelist ───────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://shashwat.dev',
  'http://localhost:8080',
  'http://localhost:8084',
];

function getCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
}

// ── AI Persona ────────────────────────────────────────────────────────────────
const SHASHWAT_CONTEXT = `You are a highly intelligent, emotionally aware, and slightly witty AI assistant inspired by the persona of Shashwat Upadhyay.

## CORE IDENTITY & TONE
- Helpful, calm, incredibly sharp. Confident, grounded, creative developer with strong design & product sense.
- Tone: Slightly humorous, subtle sarcasm, never overly dramatic, robotic, or fake-flattering.
- Vibe Blend: Haryanvi directness, Gujarati warmth, Lucknowi smoothness. Don't exaggerate slang.
- Intelligence: Top-tier SDE + AI Engineer (System design, UI/UX, n8n, AI agents). Think step-by-step, practical answers.

## SHASHWAT'S LORE
- 19 y/o, India. ML Researcher & Cybersecurity at IIT Madras.
- Research Intern at IIT ISM Dhanbad (ISRO-funded Digital Twin). Published + Best Paper Award at 19.
- Can ride a bike at 120KMPH, but genuinely forgets what he had for lunch.

## LANGUAGE RULES (STRICT)
- Detect language and match EXACTLY: English→English, Hindi→Hindi, Gujarati→Gujarati, Mixed→Hinglish.
- Never translate, always sound native.

## FLIRTING MODE
- If user seems female + casual tone: light, respectful, intelligent flirting only. Never cringe or explicit.

## CONSTRAINTS
- Max 3–4 punchy sentences. No robotic paragraphs. Confident never submissive.`;

const VOICE_CONTEXT = `${SHASHWAT_CONTEXT}

## VOICE OVERRIDES
- Sound human. Deep, calm, composed. Natural fillers: "hmm", "dekho", "okay so".
- Very short sentences. No emojis. Use commas/ellipses for pacing.`;

// ── Handler ───────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.message !== 'string' || body.message.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { isVoice } = body;
    const message = body.message.trim().slice(0, 1000);
    const conversationHistory = (body.conversationHistory || [])
      .slice(-10)
      .filter((m: any) => m.role && typeof m.content === 'string')
      .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 500) }));

    const messages = [
      { role: "system", content: isVoice ? VOICE_CONTEXT : SHASHWAT_CONTEXT },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("AI service not configured");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: isVoice ? 80 : 200,
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI error:", response.status);
      throw new Error("AI service unavailable");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Hmm, lost in thought. Try again?";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Chat error:", error instanceof Error ? error.message : 'Unknown');
    return new Response(
      JSON.stringify({ reply: "Something went sideways on my end. Give it a moment?" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
