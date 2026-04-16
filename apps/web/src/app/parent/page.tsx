import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AddChildForm } from "@/components/add-child-form";
import { thetaToLabel, tierColor } from "@/lib/scoring";
import { evaluateEarnedBadges, TOTAL_BADGES } from "@/lib/badges";
import type { BadgeStats } from "@/lib/badges";
import { AvatarIcon } from "@/components/avatar-picker";

export default async function ParentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get parent profile
  const { data: parentProfile } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("auth_user_id", user.id)
    .eq("role", "parent")
    .single();

  if (!parentProfile) redirect("/login");

  // Get children
  const { data: links } = await supabase
    .from("parent_child_links")
    .select("child_id")
    .eq("parent_id", parentProfile.id);

  const childIds = links?.map((l) => l.child_id) ?? [];

  let children: { id: string; display_name: string; age_band: string | null; avatar_id: number | null }[] = [];
  if (childIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, age_band, avatar_id")
      .in("id", childIds);
    children = data ?? [];
  }

  // Get session counts per child
  const sessionCounts: Record<string, number> = {};
  if (childIds.length > 0) {
    const { data: sessions } = await supabase
      .from("sessions")
      .select("child_id")
      .in("child_id", childIds)
      .eq("status", "completed");

    for (const s of sessions ?? []) {
      sessionCounts[s.child_id] = (sessionCounts[s.child_id] ?? 0) + 1;
    }
  }

  // Get composite scores
  const scores: Record<string, { aptitude_theta: number | null; aptitude_tier: string | null; appetite_tier: string | null; sessions_completed: number }> = {};
  if (childIds.length > 0) {
    const { data: scoreData } = await supabase
      .from("composite_scores")
      .select("child_id, aptitude_theta, aptitude_tier, appetite_tier, sessions_completed")
      .in("child_id", childIds);

    for (const s of scoreData ?? []) {
      scores[s.child_id] = s;
    }
  }

  // Check for any active sessions
  const activeSessions: Record<string, boolean> = {};
  if (childIds.length > 0) {
    const { data: active } = await supabase
      .from("sessions")
      .select("child_id")
      .in("child_id", childIds)
      .eq("status", "active");

    for (const s of active ?? []) {
      activeSessions[s.child_id] = true;
    }
  }

  // Compute badge counts per child (lightweight: session-level stats only)
  const badgeCounts: Record<string, number> = {};
  if (childIds.length > 0) {
    const { data: allSessions } = await supabase
      .from("sessions")
      .select("child_id, voluntary_bonus_rounds, terminal_theta, session_number")
      .in("child_id", childIds)
      .eq("status", "completed")
      .order("session_number", { ascending: true });

    // Get domains attempted per child from responses+items
    const { data: allResponses } = await supabase
      .from("responses")
      .select("child_id, item_id")
      .in("child_id", childIds);

    const responseItemIds = (allResponses ?? []).map((r) => r.item_id);
    let itemDomainMap = new Map<string, string>();
    if (responseItemIds.length > 0) {
      const { data: items } = await supabase
        .from("items")
        .select("id, domain")
        .in("id", responseItemIds);
      for (const item of items ?? []) {
        itemDomainMap.set(item.id, item.domain);
      }
    }

    for (const childId of childIds) {
      const childSessions = (allSessions ?? []).filter((s) => s.child_id === childId);
      const childResponses = (allResponses ?? []).filter((r) => r.child_id === childId);
      const domains = new Set<string>();
      for (const r of childResponses) {
        const d = itemDomainMap.get(r.item_id);
        if (d) domains.add(d);
      }

      const bonusTotal = childSessions.reduce((sum, s) => sum + (s.voluntary_bonus_rounds ?? 0), 0);
      const thetas = childSessions
        .filter((s) => s.terminal_theta !== null)
        .map((s) => s.terminal_theta as number);
      let thetaImproved = false;
      for (let i = 1; i < thetas.length; i++) {
        if (thetas[i] > thetas[i - 1]) { thetaImproved = true; break; }
      }

      const childScore = scores[childId];
      const stats: BadgeStats = {
        sessionsCompleted: childSessions.length,
        streakMax: 0, // skip per-response analysis for dashboard summary
        bonusRoundsTotal: bonusTotal,
        domains,
        thetaImproved,
        aptitudeTier: childScore?.aptitude_tier ?? null,
        persistedAfterWrong: false, // skip per-response analysis for dashboard summary
      };

      badgeCounts[childId] = evaluateEarnedBadges(stats).size;
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {parentProfile.display_name}</h1>
          <p className="text-gray-500 mt-1">
            {children.length > 0
              ? `Tracking ${children.length} child${children.length !== 1 ? "ren" : ""}`
              : "Get started by adding your first child"
            }
          </p>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">Add your first child</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Create a profile for your child to start their GT Challenge journey. They&apos;ll get adaptive questions calibrated to their age band.
          </p>
          <AddChildForm parentId={parentProfile.id} />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {children.map((child) => {
              const score = scores[child.id];
              const count = sessionCounts[child.id] ?? 0;
              const hasActive = activeSessions[child.id];
              return (
                <Link
                  key={child.id}
                  href={`/parent/children/${child.id}`}
                  className="block rounded-xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <AvatarIcon avatarId={child.avatar_id ?? 1} size={48} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{child.display_name}</h3>
                        {hasActive && (
                          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {child.age_band ? `Grades ${child.age_band}` : "Age band not set"} &middot; {count} session{count !== 1 ? "s" : ""}
                        {(badgeCounts[child.id] ?? 0) > 0 && (
                          <span> &middot; {badgeCounts[child.id]}/{TOTAL_BADGES} badges</span>
                        )}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>

                  {score && score.aptitude_theta !== null ? (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Aptitude</p>
                        <p className="text-sm font-semibold text-gray-800">{thetaToLabel(score.aptitude_theta)}</p>
                      </div>
                      <div className="flex gap-1.5">
                        {score.aptitude_tier && (
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tierColor(score.aptitude_tier)}`}>
                            {score.aptitude_tier.replace("_", " ")}
                          </span>
                        )}
                        {score.appetite_tier && (
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tierColor(score.appetite_tier)}`}>
                            appetite: {score.appetite_tier.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : count === 0 ? (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-400">No sessions yet &mdash; start a challenge to see scores</p>
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-amber-600">Score computing... complete a session for results.</p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="rounded-xl border border-dashed border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Add another child</h3>
            <AddChildForm parentId={parentProfile.id} />
          </div>
        </>
      )}
    </div>
  );
}
