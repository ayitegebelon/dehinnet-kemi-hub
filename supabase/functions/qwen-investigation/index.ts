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
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "QWEN_API_KEY missing" }), {
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

    const qwenRes = await fetch(`${QWEN_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!qwenRes.ok) {
      const text = await qwenRes.text();
      return new Response(JSON.stringify({ error: "Qwen API error", status: qwenRes.status, detail: text }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await qwenRes.json();
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
