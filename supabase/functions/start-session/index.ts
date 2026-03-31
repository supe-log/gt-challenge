import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { child_id, device_type } = await req.json();

    // Verify the requesting user is the parent of this child
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get parent profile
    const { data: parentProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .eq("role", "parent")
      .single();

    if (!parentProfile) {
      return new Response(JSON.stringify({ error: "Parent profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify parent-child link
    const { data: link } = await supabase
      .from("parent_child_links")
      .select("id")
      .eq("parent_id", parentProfile.id)
      .eq("child_id", child_id)
      .single();

    if (!link) {
      return new Response(JSON.stringify({ error: "Child not linked to this parent" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get child profile for age_band
    const { data: childProfile } = await supabase
      .from("profiles")
      .select("age_band")
      .eq("id", child_id)
      .single();

    // Check for active sessions (only one allowed at a time)
    const { data: activeSessions } = await supabase
      .from("sessions")
      .select("id")
      .eq("child_id", child_id)
      .eq("status", "active");

    if (activeSessions && activeSessions.length > 0) {
      // Abandon previous active sessions
      await supabase
        .from("sessions")
        .update({ status: "abandoned", ended_at: new Date().toISOString() })
        .eq("child_id", child_id)
        .eq("status", "active");
    }

    // Get previous session for theta carry-over
    const { data: prevSessions } = await supabase
      .from("sessions")
      .select("terminal_theta, session_number")
      .eq("child_id", child_id)
      .eq("status", "completed")
      .order("session_number", { ascending: false })
      .limit(1);

    const prevTheta = prevSessions?.[0]?.terminal_theta ?? null;
    const sessionNumber = (prevSessions?.[0]?.session_number ?? 0) + 1;

    // Starting theta: 90% of previous terminal theta, or 0
    const startingTheta = prevTheta !== null ? 0.9 * prevTheta : 0;

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        child_id,
        parent_id: parentProfile.id,
        session_number: sessionNumber,
        starting_theta: startingTheta,
        device_type: device_type || "web",
        status: "active",
      })
      .select("id")
      .single();

    if (sessionError) throw sessionError;

    // Select first item using Maximum Fisher Information
    const ageBand = childProfile?.age_band || "3-5";
    const { data: items } = await supabase
      .from("items")
      .select("id, domain, difficulty, discrimination, guessing, content_json")
      .eq("status", "active")
      .contains("age_bands", [ageBand]);

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items available" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Select item with maximum information at starting theta
    const selectedItem = selectMaxInfoItem(items, startingTheta);

    // Record item presentation
    await supabase.from("responses").insert({
      session_id: session.id,
      item_id: selectedItem.id,
      child_id,
      presented_at: new Date().toISOString(),
      difficulty_at_presentation: startingTheta,
    });

    return new Response(
      JSON.stringify({
        session_id: session.id,
        session_number: sessionNumber,
        item: selectedItem.content_json,
        item_id: selectedItem.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

interface ItemRow {
  id: string;
  domain: string;
  difficulty: number;
  discrimination: number;
  guessing: number;
  content_json: unknown;
}

function selectMaxInfoItem(items: ItemRow[], theta: number): ItemRow {
  let bestItem = items[0];
  let bestInfo = -Infinity;

  for (const item of items) {
    const info = fisherInformation(theta, item.discrimination, item.difficulty, item.guessing);
    if (info > bestInfo) {
      bestInfo = info;
      bestItem = item;
    }
  }

  return bestItem;
}

function probability3PL(theta: number, a: number, b: number, c: number): number {
  const exponent = -a * (theta - b);
  const expVal = Math.exp(Math.min(Math.max(exponent, -700), 700));
  return c + (1 - c) / (1 + expVal);
}

function fisherInformation(theta: number, a: number, b: number, c: number): number {
  const P = probability3PL(theta, a, b, c);
  if (P <= c || P >= 1) return 0;
  const numerator = a * a * (P - c) * (P - c) * (1 - P);
  const denominator = (1 - c) * (1 - c) * P;
  return numerator / denominator;
}
