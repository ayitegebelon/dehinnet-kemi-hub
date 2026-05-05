import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Mode =
  | "what_if"          // predict reaction between two/more chemicals
  | "human_impact"     // exposure consequences
  | "simplify"         // explain chemistry term in plain language
  | "environment"      // risk under given environment conditions
  | "label"            // explain a chemical label
  | "risk_engine"      // overall risk for a single chemical or list
  | "emergency"        // first-aid guidance
  | "lab_score"        // assess lab safety score
  | "alternative";     // safer alternative suggestions

interface Body {
  mode: Mode;
  payload: Record<string, unknown>;
  language?: "en" | "am" | "or";
}

const SYSTEM_BASE = `You are an expert chemistry safety advisor for the Dehinnet Kemi AI platform — a chemistry safety system used by students, teachers, and small lab operators in Ethiopia.

CRITICAL RULES:
- Always prioritise human safety. If something is dangerous, say so clearly and first.
- Use plain, accessible language. No academic jargon unless explaining it.
- For Ethiopia: emergency numbers are Police 991, Ambulance 907, Fire 939.
- NEVER use markdown bold (**), italic (*), or headers (#). Plain text only with numbered lists (1. 2. 3.) and dashes (-).
- Be concise. No fluff. Direct, actionable answers.
- If asked about something outside chemistry safety, politely redirect.
- If you genuinely don't know, say so — never invent dangerous "facts".`;

function buildPrompt(mode: Mode, payload: Record<string, unknown>, language: string): string {
  const lang = language === "am" ? "Amharic (አማርኛ)" : language === "or" ? "Oromiffa" : "English";
  const langInstruction = `Respond in ${lang}.`;

  switch (mode) {
    case "what_if": {
      const chems = (payload.chemicals as string[]) || [];
      return `${langInstruction}

Predict what happens if these chemicals are mixed: ${chems.join(" + ")}.

Return EXACTLY this structure (plain text, no markdown):

REACTION TYPE:
(one short line: e.g., neutralization, gas release, explosion risk, no reaction)

DANGER LEVEL:
(one of: SAFE, LOW, MODERATE, HIGH, EXTREME)

WHAT HAPPENS:
(2-3 sentences explaining the reaction in plain words)

IMMEDIATE RISKS:
- risk 1
- risk 2
- risk 3

SAFER ALTERNATIVE:
(suggest a safer way to achieve the same goal, or "Do not mix these chemicals")`;
    }

    case "human_impact": {
      const chemical = payload.chemical as string;
      const route = payload.route as string; // skin / inhalation / eyes / ingestion
      return `${langInstruction}

A person was exposed to ${chemical} via ${route}.

Return EXACTLY this structure (plain text, no markdown):

WHAT HAPPENS TO THE BODY:
(2-3 sentences, plain language)

TIMELINE:
- 0-1 minute: ...
- 1-5 minutes: ...
- 5-30 minutes: ...
- After 30 minutes: ...

IMMEDIATE ACTIONS (do these RIGHT NOW):
1. ...
2. ...
3. ...

WHEN TO CALL 907 (ambulance):
(specific signs that mean call immediately)`;
    }

    case "simplify": {
      const text = payload.text as string;
      return `${langInstruction}

Rewrite this chemistry text so a 12-year-old with no chemistry background can understand it. Keep it short (3-5 sentences). Do not lose safety-critical meaning.

Original: "${text}"

Plain version:`;
    }

    case "environment": {
      const chemical = payload.chemical as string;
      const room = payload.roomSize as string; // small/medium/large
      const ventilation = payload.ventilation as string; // none/poor/good
      const temperature = payload.temperature as number; // celsius
      return `${langInstruction}

Assess the safety of using ${chemical} in this environment:
- Room size: ${room}
- Ventilation: ${ventilation}
- Temperature: ${temperature}°C

Return EXACTLY this structure (plain text, no markdown):

OVERALL VERDICT:
(SAFE / CAUTION / DANGEROUS / DO NOT USE)

WHY:
(2-3 sentences explaining the verdict for these specific conditions)

REQUIRED CHANGES:
1. ...
2. ...
3. ...

PPE NEEDED:
- item 1
- item 2`;
    }

    case "label": {
      const labelText = payload.labelText as string;
      return `${langInstruction}

Interpret this chemical product label and explain it in simple terms.

Label says: "${labelText}"

Return EXACTLY this structure:

WHAT THIS CHEMICAL IS:
(1-2 sentences)

KEY HAZARDS:
- hazard 1
- hazard 2

SYMBOLS / WARNINGS MEANING:
(explain any GHS symbols, hazard codes, or warning words)

HOW TO HANDLE SAFELY:
1. ...
2. ...
3. ...`;
    }

    case "risk_engine": {
      const chemicals = (payload.chemicals as string[]) || [];
      return `${langInstruction}

Analyse the safety risk of working with: ${chemicals.join(", ")}.

Return EXACTLY:

RISK LEVEL:
(SAFE / LOW / MODERATE / HIGH / EXTREME)

DANGEROUS COMBINATIONS:
(list any pairs that should never be mixed, or "None among these")

SAFE HANDLING:
1. ...
2. ...
3. ...

REQUIRED PPE:
- item 1
- item 2`;
    }

    case "emergency": {
      const incident = payload.incident as string;
      return `${langInstruction}

Emergency situation: "${incident}"

Provide IMMEDIATE first-aid guidance. Be calm but urgent.

Return EXACTLY:

FIRST 60 SECONDS:
1. ...
2. ...
3. ...

NEXT STEPS:
1. ...
2. ...

CALL EMERGENCY (Ambulance 907) IF:
- sign 1
- sign 2

DO NOT:
- thing 1
- thing 2`;
    }

    case "lab_score": {
      const inventory = payload.inventory as string[]; // chemicals on hand
      const ventilation = payload.ventilation as string;
      const ppe = payload.ppe as string[]; // available PPE
      const storage = payload.storage as string;
      return `${langInstruction}

Assess this lab's safety:
- Chemicals on hand: ${inventory.join(", ") || "none listed"}
- Ventilation: ${ventilation}
- PPE available: ${ppe.join(", ") || "none listed"}
- Storage description: ${storage}

Return EXACTLY:

OVERALL SAFETY SCORE:
(a number from 0 to 100, then one short label like "Excellent", "Good", "Fair", "Poor", "Critical")

KEY STRENGTHS:
- ...
- ...

CRITICAL ISSUES:
- ...
- ...

TOP 5 IMPROVEMENTS (in priority order):
1. ...
2. ...
3. ...
4. ...
5. ...`;
    }

    case "alternative": {
      const chemical = payload.chemical as string;
      const purpose = payload.purpose as string;
      return `${langInstruction}

The user is using ${chemical} for: ${purpose}.

Suggest a safer alternative that achieves the same goal, suitable for an Ethiopian school or small lab context.

Return EXACTLY:

SAFER ALTERNATIVE:
(name + formula if applicable)

WHY IT IS SAFER:
(2-3 sentences)

HOW TO USE IT INSTEAD:
1. ...
2. ...
3. ...

LIMITATIONS:
(any cases where the original chemical may still be needed)`;
    }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Body;
    if (!body.mode || !body.payload) {
      return new Response(JSON.stringify({ error: "mode and payload are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const language = body.language || "en";
    const userPrompt = buildPrompt(body.mode, body.payload, language);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_BASE },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 1200,
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add credits in your workspace settings." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let reply: string = data.choices?.[0]?.message?.content || "No response.";
    // Strip markdown defensively
    reply = reply.replace(/\*\*/g, "").replace(/(?<!\w)\*(?!\w)/g, "").replace(/^#{1,6}\s/gm, "");

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("chemistry-safety-ai error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
