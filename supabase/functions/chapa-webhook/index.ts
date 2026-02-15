import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CHAPA_SECRET = Deno.env.get("CHAPA_SECRET_KEY");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get the transaction reference from the webhook payload
    const body = await req.json();
    const txRef = body.tx_ref || body.trx_ref;

    if (!txRef) {
      return new Response(JSON.stringify({ error: "No tx_ref" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the transaction with Chapa
    const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET}` },
    });

    const verifyData = await verifyRes.json();

    if (verifyData.status === "success" && verifyData.data.status === "success") {
      const meta = verifyData.data.meta || {};
      const userId = meta.user_id;
      const plan = meta.plan;

      if (userId && plan) {
        // Update user subscription
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        await supabase
          .from("profiles")
          .update({
            subscription_tier: plan,
            subscription_expiry: expiryDate.toISOString().split("T")[0],
          })
          .eq("user_id", userId);

        return new Response(JSON.stringify({ status: "success" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ status: "failed", data: verifyData }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
