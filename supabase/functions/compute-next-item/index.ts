import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── IRT Math (inlined to avoid Deno import issues) ─────────────

function probability3PL(theta: number, a: number, b: number, c: number): number {
  const exponent = -a * (theta - b);
  const expVal = Math.exp(Math.min(Math.max(exponent, -700), 700));
  return c + (1 - c) / (1 + expVal);
}

function fisherInformation(theta: number, a: number, b: number, c: number): number {
  const P = probability3PL(theta, a, b, c);
  if (P <= c || P >= 1) return 0;
  return (a * a * (P - c) * (P - c) * (1 - P)) / ((1 - c) * (1 - c) * P);
}

function normalPDF(x: number, mean: number, sd: number): number {
  const z = (x - mean) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}

interface ResponseForEAP {
  itemId: string;
  isCorrect: boolean;
}

interface ItemParams {
  id: string;
  discrimination: number;
  difficulty: number;
  guessing: number;
}

function estimateThetaEAP(
  responses: ResponseForEAP[],
  items: Map<string, ItemParams>,
  priorMean: number,
  priorSD: number
): number {
  if (responses.length === 0) return priorMean;

  let numerator = 0;
  let denominator = 0;

  for (let q = -4; q <= 4; q += 0.1) {
    const theta = Math.round(q * 100) / 100;
    let logLikelihood = Math.log(normalPDF(theta, priorMean, priorSD));

    for (const response of responses) {
      const item = items.get(response.itemId);
      if (!item) continue;
      const p = probability3PL(theta, item.discrimination, item.difficulty, item.guessing);
      logLikelihood += response.isCorrect
        ? Math.log(Math.max(p, 1e-10))
        : Math.log(Math.max(1 - p, 1e-10));
    }

    const weight = Math.exp(logLikelihood);
    numerator += theta * weight;
    denominator += weight;
  }

  return denominator === 0 ? priorMean : numerator / denominator;
}

function computeSE(theta: number, items: ItemParams[]): number {
  if (items.length === 0) return Infinity;
  let totalInfo = 0;
  for (const item of items) {
    totalInfo += fisherInformation(theta, item.discrimination, item.difficulty, item.guessing);
  }
  return totalInfo <= 0 ? Infinity : 1 / Math.sqrt(totalInfo);
}

// ─── Session Config ─────────────────────────────────────────────

const MIN_ITEMS = 20;
const MAX_ITEMS = 40;
const MAX_TIME_MS = 35 * 60 * 1000;
const SE_TARGET = 0.25;
const MAX_CONSECUTIVE_SAME_DOMAIN = 3;
const MAX_DOMAIN_PROPORTION = 0.30;

// ─── Main Handler ───────────────────────────────────────────────

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

    const { session_id, item_id, answer_index, time_on_item_ms, idle_time_ms } = await req.json();

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", session_id)
      .eq("status", "active")
      .single();

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: "Session not found or inactive" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the item that was answered
    const { data: answeredItem } = await supabase
      .from("items")
      .select("id, domain, difficulty, discrimination, guessing, content_json")
      .eq("id", item_id)
      .single();

    if (!answeredItem) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Score the response
    const contentJson = answeredItem.content_json as { correct_index: number };
    const isCorrect = answer_index === contentJson.correct_index;

    // Update the response record (created at item presentation)
    await supabase
      .from("responses")
      .update({
        answered_at: new Date().toISOString(),
        time_on_item_ms,
        answer_given: { index: answer_index },
        is_correct: isCorrect,
        idle_time_ms: idle_time_ms || 0,
      })
      .eq("session_id", session_id)
      .eq("item_id", item_id)
      .is("answered_at", null);

    // Note: item exposure_count update skipped — requires admin/service role
    // TODO: Add a trigger or RPC for this when deploying to production

    // Update session counts
    const newItemsAttempted = session.items_attempted + 1;
    const newItemsCorrect = session.items_correct + (isCorrect ? 1 : 0);
    await supabase
      .from("sessions")
      .update({
        items_attempted: newItemsAttempted,
        items_correct: newItemsCorrect,
      })
      .eq("id", session_id);

    // Get ALL responses for this session to compute theta
    const { data: allResponses } = await supabase
      .from("responses")
      .select("item_id, is_correct")
      .eq("session_id", session_id)
      .not("is_correct", "is", null);

    // Get all item params for those responses
    const responseItemIds = allResponses?.map((r) => r.item_id) ?? [];
    const { data: responseItems } = await supabase
      .from("items")
      .select("id, domain, difficulty, discrimination, guessing")
      .in("id", responseItemIds);

    const itemMap = new Map<string, ItemParams>();
    for (const item of responseItems ?? []) {
      itemMap.set(item.id, item);
    }

    const eapResponses: ResponseForEAP[] = (allResponses ?? []).map((r) => ({
      itemId: r.item_id,
      isCorrect: r.is_correct,
    }));

    // Compute current theta
    const currentTheta = estimateThetaEAP(
      eapResponses,
      itemMap,
      session.starting_theta,
      1.0
    );

    const administeredItems = (responseItems ?? []).map((item) => ({
      ...item,
      id: item.id,
    }));
    const se = computeSE(currentTheta, administeredItems);

    // Check elapsed time
    const elapsedMs = Date.now() - new Date(session.started_at).getTime();

    // Check termination
    let shouldStop = false;
    let reason = "";

    if (elapsedMs >= MAX_TIME_MS) {
      shouldStop = true;
      reason = "time_limit";
    } else if (newItemsAttempted >= MAX_ITEMS) {
      shouldStop = true;
      reason = "max_items";
    } else if (newItemsAttempted >= MIN_ITEMS && se <= SE_TARGET) {
      shouldStop = true;
      reason = "precision_reached";
    }

    if (shouldStop) {
      // Find highest difficulty answered correctly
      let highestDifficulty = -3;
      for (const r of allResponses ?? []) {
        if (r.is_correct) {
          const item = itemMap.get(r.item_id);
          if (item && item.difficulty > highestDifficulty) {
            highestDifficulty = item.difficulty;
          }
        }
      }

      // End session
      await supabase
        .from("sessions")
        .update({
          status: "completed",
          terminal_theta: currentTheta,
          terminal_se: se,
          ended_at: new Date().toISOString(),
          duration_seconds: Math.round(elapsedMs / 1000),
        })
        .eq("id", session_id);

      // Trigger composite score computation (inline for now)
      await computeCompositeScore(supabase, session.child_id, session.parent_id);

      // Compute appetite signals
      await computeAppetiteSignals(supabase, session.child_id, session_id);

      return new Response(
        JSON.stringify({
          done: true,
          items_completed: newItemsAttempted,
          items_correct: newItemsCorrect,
          highest_difficulty_reached: highestDifficulty,
          bonus_rounds_completed: session.voluntary_bonus_rounds,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─── Select next item ─────────────────────────────────────────

    // Get child's age band
    const { data: childProfile } = await supabase
      .from("profiles")
      .select("age_band")
      .eq("id", session.child_id)
      .single();

    const ageBand = childProfile?.age_band || "3-5";

    // Get all available items
    const { data: allItems } = await supabase
      .from("items")
      .select("id, domain, difficulty, discrimination, guessing, content_json, exposure_count")
      .eq("status", "active")
      .contains("age_bands", [ageBand]);

    const administeredIds = new Set(responseItemIds);
    const eligibleItems = (allItems ?? []).filter(
      (item) => !administeredIds.has(item.id)
    );

    if (eligibleItems.length === 0) {
      // No more items — force terminate
      await supabase
        .from("sessions")
        .update({
          status: "completed",
          terminal_theta: currentTheta,
          terminal_se: se,
          ended_at: new Date().toISOString(),
          duration_seconds: Math.round(elapsedMs / 1000),
        })
        .eq("id", session_id);

      await computeCompositeScore(supabase, session.child_id, session.parent_id);
      await computeAppetiteSignals(supabase, session.child_id, session_id);

      return new Response(
        JSON.stringify({
          done: true,
          items_completed: newItemsAttempted,
          items_correct: newItemsCorrect,
          highest_difficulty_reached: -3,
          bonus_rounds_completed: session.voluntary_bonus_rounds,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build domain history for content balancing
    const domainHistory = (allResponses ?? []).map((r) => {
      const item = itemMap.get(r.item_id);
      return item?.domain ?? "";
    });

    const domainCounts: Record<string, number> = {};
    for (const d of domainHistory) {
      domainCounts[d] = (domainCounts[d] ?? 0) + 1;
    }

    // Select next item with max info + content balancing + weighted randomization
    const scored: { item: typeof eligibleItems[0]; score: number }[] = [];

    for (const item of eligibleItems) {
      let score = fisherInformation(
        currentTheta,
        item.discrimination,
        item.difficulty,
        item.guessing
      );

      // Content balancing: penalize consecutive same domain
      const lastDomains = domainHistory.slice(-MAX_CONSECUTIVE_SAME_DOMAIN);
      const consecutive = countTrailing(lastDomains, item.domain);
      if (consecutive >= MAX_CONSECUTIVE_SAME_DOMAIN) {
        score *= 0.05;
      } else if (consecutive >= MAX_CONSECUTIVE_SAME_DOMAIN - 1) {
        score *= 0.3;
      }

      // Domain balance: hard cap at 30%, soft penalty at 25%
      const total = Object.values(domainCounts).reduce((a, b) => a + b, 0);
      if (total > 0) {
        const proportion = (domainCounts[item.domain] ?? 0) / total;
        if (proportion > MAX_DOMAIN_PROPORTION) score *= 0.05;
        else if (proportion > 0.25) score *= 0.4;
      }

      scored.push({ item, score });
    }

    // Weighted random from top 3 candidates (avoids identical sequences)
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, Math.min(3, scored.length));
    const totalScore = top.reduce((s, t) => s + Math.max(t.score, 0.001), 0);
    let rand = Math.random() * totalScore;
    let bestItem = top[0].item;
    for (const t of top) {
      rand -= Math.max(t.score, 0.001);
      if (rand <= 0) { bestItem = t.item; break; }
    }

    // Record next item presentation
    await supabase.from("responses").insert({
      session_id,
      item_id: bestItem.id,
      child_id: session.child_id,
      presented_at: new Date().toISOString(),
      difficulty_at_presentation: currentTheta,
    });

    // Offer bonus round every 10 items
    const offerBonusRound = newItemsAttempted > 0 && newItemsAttempted % 10 === 0;

    return new Response(
      JSON.stringify({
        done: false,
        item: bestItem.content_json,
        item_id: bestItem.id,
        item_domain: bestItem.domain,
        items_completed: newItemsAttempted,
        offer_bonus_round: offerBonusRound,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function countTrailing(arr: string[], value: string): number {
  let count = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === value) count++;
    else break;
  }
  return count;
}

// deno-lint-ignore no-explicit-any
async function computeCompositeScore(supabase: any, childId: string, parentId: string) {
  const LAMBDA = 0.7;

  const { data: sessions } = await supabase
    .from("sessions")
    .select("terminal_theta, session_number")
    .eq("child_id", childId)
    .eq("status", "completed")
    .order("session_number", { ascending: true });

  if (!sessions || sessions.length === 0) return;

  const thetas = sessions.map((s: { terminal_theta: number }) => s.terminal_theta);
  const n = thetas.length;

  let weightedSum = 0;
  let totalWeight = 0;
  for (let i = 0; i < n; i++) {
    const weight = Math.pow(LAMBDA, n - 1 - i);
    weightedSum += thetas[i] * weight;
    totalWeight += weight;
  }

  const compositeTheta = weightedSum / totalWeight;

  // Determine tier
  let tier = null;
  if (compositeTheta >= 1.5) tier = "exceptional";
  else if (compositeTheta >= 0.75) tier = "very_high";
  else if (compositeTheta >= 0) tier = "high";

  // Upsert composite score (aptitude only — appetite updated separately)
  await supabase.from("composite_scores").upsert(
    {
      child_id: childId,
      parent_id: parentId,
      aptitude_theta: compositeTheta,
      aptitude_tier: tier,
      sessions_completed: n,
      computed_at: new Date().toISOString(),
    },
    { onConflict: "child_id" }
  );
}

// ─── Appetite Signal Computation (inlined from @gt-challenge/appetite-engine) ──

// deno-lint-ignore no-explicit-any
async function computeAppetiteSignals(supabase: any, childId: string, sessionId: string) {
  try {
    // Get all completed sessions for this child
    const { data: sessions } = await supabase
      .from("sessions")
      .select("id, session_number, started_at, ended_at, terminal_theta, items_attempted, items_correct, voluntary_bonus_rounds, duration_seconds")
      .eq("child_id", childId)
      .eq("status", "completed")
      .order("session_number", { ascending: true });

    if (!sessions || sessions.length === 0) return;

    // Get all responses for this child's completed sessions
    const sessionIds = sessions.map((s: { id: string }) => s.id);
    const { data: allResponses } = await supabase
      .from("responses")
      .select("session_id, is_correct, time_on_item_ms, idle_time_ms, presented_at")
      .in("session_id", sessionIds)
      .not("is_correct", "is", null);

    // Group responses by session
    const responsesBySession: Record<string, { is_correct: boolean }[]> = {};
    for (const r of allResponses ?? []) {
      if (!responsesBySession[r.session_id]) responsesBySession[r.session_id] = [];
      responsesBySession[r.session_id].push(r);
    }

    // ── Signal 1: return_visit ──
    let returnVisitValue = 0;
    if (sessions.length > 1) {
      const baseScore = Math.min(1, sessions.length / 5);
      const gaps: number[] = [];
      for (let i = 1; i < sessions.length; i++) {
        const daysBetween = (new Date(sessions[i].started_at).getTime() - new Date(sessions[i - 1].ended_at).getTime()) / (1000 * 60 * 60 * 24);
        gaps.push(daysBetween);
      }
      const avgGap = gaps.reduce((a: number, b: number) => a + b, 0) / gaps.length;
      const recencyBonus = Math.max(0, Math.min(1, (14 - avgGap) / 13));
      returnVisitValue = Math.min(1, baseScore * 0.7 + recencyBonus * 0.3);
    }

    // ── Signal 2: persistence ──
    let persistenceTotal = 0;
    for (const sid of sessionIds) {
      const responses = responsesBySession[sid] ?? [];
      if (responses.length === 0) continue;
      const firstWrong = responses.findIndex((r: { is_correct: boolean }) => !r.is_correct);
      if (firstWrong === -1) { persistenceTotal += 1; continue; }
      const itemsAfter = responses.length - firstWrong - 1;
      const maxRemaining = Math.max(1, 25 - firstWrong);
      persistenceTotal += Math.min(1, itemsAfter / maxRemaining);
    }
    const persistenceValue = Math.min(1, Math.max(0, persistenceTotal / sessions.length));

    // ── Signal 3: voluntary_hard ──
    let totalBonus = 0, totalOffered = 0;
    for (const s of sessions) {
      totalBonus += s.voluntary_bonus_rounds;
      totalOffered += Math.floor(s.items_attempted / 10);
    }
    const voluntaryHardValue = totalOffered === 0 ? 0 : Math.min(1, totalBonus / totalOffered);

    // ── Signal 4: learning_velocity ──
    let learningVelocityValue = 0;
    if (sessions.length >= 2) {
      const firstTheta = sessions[0].terminal_theta;
      const lastTheta = sessions[sessions.length - 1].terminal_theta;
      learningVelocityValue = Math.min(1, Math.max(0, (lastTheta - firstTheta + 1) / 2));
    }

    // ── Signal 5: time_investment ──
    const totalSeconds = sessions.reduce((sum: number, s: { duration_seconds: number | null }) => sum + (s.duration_seconds ?? 0), 0);
    const timeInvestmentValue = Math.min(1, (totalSeconds / 60) / 150);

    // ── Signal 6: streak (consecutive weeks) ──
    const weekKeys = sessions.map((s: { started_at: string }) => {
      const d = new Date(s.started_at);
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
      const weekNum = 1 + Math.round(((d.getTime() - yearStart.getTime()) / 86400000 - 3 + ((yearStart.getUTCDay() + 6) % 7)) / 7);
      return `${d.getUTCFullYear()}-${String(weekNum).padStart(2, "0")}`;
    });
    const uniqueWeeks = [...new Set(weekKeys)].sort();
    let maxStreak = 1, currentStreak = 1;
    for (let i = 1; i < uniqueWeeks.length; i++) {
      const [yA, wA] = uniqueWeeks[i - 1].split("-").map(Number);
      const [yB, wB] = uniqueWeeks[i].split("-").map(Number);
      const consecutive = (yA === yB && wB === wA + 1) || (yB === yA + 1 && wB === 1 && wA >= 52);
      if (consecutive) { currentStreak++; maxStreak = Math.max(maxStreak, currentStreak); }
      else { currentStreak = 1; }
    }
    const streakValue = Math.min(1, maxStreak / 5);

    // ── Composite ──
    const signals = [
      { type: "return_visit", value: returnVisitValue },
      { type: "persistence", value: persistenceValue },
      { type: "voluntary_hard", value: voluntaryHardValue },
      { type: "learning_velocity", value: learningVelocityValue },
      { type: "time_investment", value: timeInvestmentValue },
      { type: "streak", value: streakValue },
    ];

    const compositeScore = signals.reduce((sum, s) => sum + s.value, 0) / signals.length;
    let appetiteTier = null;
    if (compositeScore >= 0.7) appetiteTier = "exceptional";
    else if (compositeScore >= 0.4) appetiteTier = "very_high";
    else if (compositeScore >= 0.2) appetiteTier = "high";

    // Write signals to appetite_signals table
    for (const signal of signals) {
      await supabase.from("appetite_signals").insert({
        child_id: childId,
        signal_type: signal.type,
        signal_value: signal.value,
        session_id: sessionId,
        raw_data: {},
      });
    }

    // Update composite_scores with appetite
    await supabase
      .from("composite_scores")
      .update({
        appetite_score: compositeScore,
        appetite_tier: appetiteTier,
      })
      .eq("child_id", childId);
  } catch (err) {
    // Don't fail the session completion if appetite computation fails
    console.error("Appetite signal computation failed:", err);
  }
}
