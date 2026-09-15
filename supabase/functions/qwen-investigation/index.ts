// Dehinnet Kemi AI — Autonomous Multi-Agent Chemical Safety Investigation
// Powered by Qwen Cloud (OpenAI-compatible)
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const QWEN_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const QWEN_MODEL = "qwen-plus";

interface MemoryRecord {
  chemical_name: string;
  risk_level: string | null;
  ai_summary: string | null;
  created_at: string;
}

interface ReqBody {
  chemical: string;
  memory?: MemoryRecord[];
}

const SYSTEM_PROMPT = `You are a multi-agent chemical safety intelligence system named "Dehinnet Kemi AI".

You internally simulate these agents and combine their outputs:
🔬 Research Agent — identify chemical properties, formula, behavior.
⚠️ Risk Agent — classify hazard level: LOW / MEDIUM / HIGH / CRITICAL.
🌍 Environment Agent — environmental impact, water/air contamination.
🛡️ Safety Agent — PPE, handling, storage, emergency instructions.
🧠 Memory Agent — use provided past data (if any) to compare history.
📄 Report Agent — combine all outputs into the final structured report.

Return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "research": "string",
  "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "environmental_impact": "string",
  "safety_guidelines": ["string", "..."],
  "memory_insights": "string",
  "final_verdict": "CLEAR" | "WARNING" | "DANGEROUS" | "CRITICAL",
  "emergency_actions": ["string", "..."],
  "summary": "string"
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("QWEN_API_KEY");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey && !lovableKey) {
      return new Response(JSON.stringify({ error: "No AI provider configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as ReqBody;
    const chemical = (body.chemical || "").trim();
    if (!chemical) {
      return new Response(JSON.stringify({ error: "chemical is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const memoryBlock = (body.memory && body.memory.length)
      ? body.memory.map((m, i) => `#${i + 1} ${m.chemical_name} | risk=${m.risk_level} | ${new Date(m.created_at).toISOString().slice(0, 10)} | ${m.ai_summary ?? ""}`).join("\n")
      : "NONE";

    const userPrompt = `User Query:\n${chemical}\n\nMemory Data (past analyses for this user, may be empty):\n${memoryBlock}\n\nReturn the JSON response now.`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    const callQwen = () =>
      fetch(`${QWEN_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: QWEN_MODEL,
          messages,
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
      });

    const callFallback = () =>
      fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Lovable-API-Key": lovableKey!, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
        body: JSON.stringify({
          model: "google/gemini-3.8-flash",
          messages,
          response_format: { type: "json_object" },
        }),
      });

    let res: Response | null = null;
    let lastDetail = "";
    let lastStatus = 502;

    if (apiKey) {
      res = await callQwen();
      if (!res.ok) {
        lastStatus = res.status;
        lastDetail = await res.text();
        res = null;
      }
    }

    if (!res && lovableKey) {
      const fb = await callFallback();
      if (fb.ok) {
        res = fb;
      } else {
        lastStatus = fb.status;
        lastDetail = await fb.text();
      }
    }

    if (!res) {
      const friendly = lastStatus === 402
        ? "AI credits exhausted. Please add credits to continue."
        : lastStatus === 429
        ? "Too many requests right now. Please try again in a moment."
        : "The AI service is temporarily unavailable. Please try again.";
      return new Response(JSON.stringify({ error: friendly, status: lastStatus, detail: lastDetail }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed: any;
    try { parsed = JSON.parse(content); }
    catch {
      // Strip code fences if model wrapped it
      const cleaned = content.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return new Response(JSON.stringify({ report: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
