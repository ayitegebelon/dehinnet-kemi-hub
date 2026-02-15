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
    if (!CHAPA_SECRET) {
      return new Response(JSON.stringify({ error: "Chapa not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { plan, phone } = await req.json();
    const amount = plan === "premium" ? 199 : 999;
    const txRef = `TX-${user.id.slice(0, 8)}-${Date.now()}`;

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", user.id)
      .maybeSingle();

    // Initialize Chapa payment
    const chapaRes = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: "ETB",
        email: profile?.email || user.email,
        first_name: profile?.full_name?.split(" ")[0] || "User",
        last_name: profile?.full_name?.split(" ").slice(1).join(" ") || "",
        phone_number: phone,
        tx_ref: txRef,
        callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/chapa-webhook`,
        return_url: `${req.headers.get("origin") || ""}/subscription?payment=success`,
        customization: {
          title: `ChemLab ${plan} Subscription`,
          description: `Monthly ${plan} subscription`,
        },
        meta: {
          user_id: user.id,
          plan: plan,
        },
      }),
    });

    const chapaData = await chapaRes.json();

    if (chapaData.status === "success") {
      return new Response(JSON.stringify({
        checkout_url: chapaData.data.checkout_url,
        tx_ref: txRef,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      console.error("Chapa error:", chapaData);
      return new Response(JSON.stringify({ error: chapaData.message || "Payment initialization failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
