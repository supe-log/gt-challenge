/**
 * Admin Dashboard — Organization-level view of all children across GT Challenge.
 *
 * To create an admin user:
 * 1. Sign up normally as a parent
 * 2. In Supabase SQL editor, run:
 *    UPDATE profiles SET role = 'admin' WHERE auth_user_id = 'YOUR_AUTH_USER_ID';
 *
 * The admin RLS policies (migration 00009) grant SELECT access to all profiles,
 * sessions, composite_scores, responses, and parent_child_links for admin users.
 */

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { tierColor } from "@/lib/scoring";

const DOMAIN_CONFIG: Record<string, { label: string; color: string }> = {
  reasoning: { label: "Reasoning", color: "bg-purple-500" },
  math: { label: "Math", color: "bg-blue-500" },
  verbal: { label: "Verbal", color: "bg-emerald-500" },
  pattern_recognition: { label: "Patterns", color: "bg-amber-500" },
};

const AGE_BAND_LABELS: Record<string, string> = {
  "K-2": "K-2",
  "3-5": "3-5",
  "6-8": "6-8",
};

const AGE_BAND_ORDER = ["K-2", "3-5", "6-8"];

const APTITUDE_TIERS = ["exceptional", "very_high", "high"] as const;
const APPETITE_TIERS = ["exceptional", "very_high", "high"] as const;

const TIER_CHART_COLORS: Record<string, string> = {
  exceptional: "bg-purple-500",
  very_high: "bg-blue-500",
  high: "bg-green-500",
  developing: "bg-gray-400",
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get admin profile
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("auth_user_id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "admin") redirect("/parent");

  // ─── Fetch all child profiles ────────────────────────────────────
  const { data: allChildren } = await supabase
    .from("profiles")
    .select("id, display_name, age_band, created_at")
    .eq("role", "child")
    .order("created_at", { ascending: false });

  const children = allChildren ?? [];
  const childIds = children.map((c) => c.id);

  // ─── Fetch all completed sessions ────────────────────────────────
  let allSessions: { child_id: string; items_attempted: number; started_at: string }[] = [];
  if (childIds.length > 0) {
    const { data } = await supabase
      .from("sessions")
      .select("child_id, items_attempted, started_at")
      .in("child_id", childIds)
      .eq("status", "completed");
    allSessions = data ?? [];
  }

  // ─── Fetch all composite scores ──────────────────────────────────
  let allScores: { child_id: string; aptitude_tier: string | null; appetite_tier: string | null; sessions_completed: number }[] = [];
  if (childIds.length > 0) {
    const { data } = await supabase
      .from("composite_scores")
      .select("child_id, aptitude_tier, appetite_tier, sessions_completed")
      .in("child_id", childIds);
    allScores = data ?? [];
  }

  const scoreMap = new Map(allScores.map((s) => [s.child_id, s]));

  // ─── Fetch all responses for domain performance ──────────────────
  let domainStats: Record<string, { correct: number; total: number }> = {};
  if (childIds.length > 0) {
    const { data: responses } = await supabase
      .from("responses")
      .select("item_id, is_correct")
      .in("child_id", childIds)
      .not("is_correct", "is", null);

    if (responses && responses.length > 0) {
      const itemIds = [...new Set(responses.map((r) => r.item_id))];
      const { data: items } = await supabase
        .from("items")
        .select("id, domain")
        .in("id", itemIds);

      const itemDomainMap = new Map<string, string>();
      for (const item of items ?? []) {
        itemDomainMap.set(item.id, item.domain);
      }

      for (const r of responses) {
        const domain = itemDomainMap.get(r.item_id);
        if (!domain) continue;
        if (!domainStats[domain]) domainStats[domain] = { correct: 0, total: 0 };
        domainStats[domain].total++;
        if (r.is_correct) domainStats[domain].correct++;
      }
    }
  }

  // ─── Compute aggregate stats ─────────────────────────────────────
  const totalChildren = children.length;
  const totalSessions = allSessions.length;
  const totalItems = allSessions.reduce((sum, s) => sum + s.items_attempted, 0);

  // Active this week: children with sessions started in the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const activeThisWeek = new Set(
    allSessions
      .filter((s) => new Date(s.started_at) >= oneWeekAgo)
      .map((s) => s.child_id)
  ).size;

  // ─── Demographic breakdown by age band ───────────────────────────
  const ageBandCounts: Record<string, number> = {};
  for (const band of AGE_BAND_ORDER) {
    ageBandCounts[band] = 0;
  }
  for (const child of children) {
    if (child.age_band && ageBandCounts[child.age_band] !== undefined) {
      ageBandCounts[child.age_band]++;
    }
  }
  const maxAgeBand = Math.max(...Object.values(ageBandCounts), 1);

  // ─── Aptitude tier distribution ──────────────────────────────────
  const aptitudeCounts: Record<string, number> = {
    exceptional: 0,
    very_high: 0,
    high: 0,
    developing: 0,
  };
  for (const score of allScores) {
    if (score.aptitude_tier && aptitudeCounts[score.aptitude_tier] !== undefined) {
      aptitudeCounts[score.aptitude_tier]++;
    } else {
      aptitudeCounts.developing++;
    }
  }
  // Children without scores at all are "developing"
  const childrenWithScores = new Set(allScores.map((s) => s.child_id));
  for (const child of children) {
    if (!childrenWithScores.has(child.id)) {
      aptitudeCounts.developing++;
    }
  }
  const maxAptitude = Math.max(...Object.values(aptitudeCounts), 1);

  // ─── Appetite tier distribution ──────────────────────────────────
  const appetiteCounts: Record<string, number> = {
    exceptional: 0,
    very_high: 0,
    high: 0,
    developing: 0,
  };
  for (const score of allScores) {
    if (score.appetite_tier && appetiteCounts[score.appetite_tier] !== undefined) {
      appetiteCounts[score.appetite_tier]++;
    } else {
      appetiteCounts.developing++;
    }
  }
  for (const child of children) {
    if (!childrenWithScores.has(child.id)) {
      appetiteCounts.developing++;
    }
  }
  const maxAppetite = Math.max(...Object.values(appetiteCounts), 1);

  // ─── Session counts per child for the recent table ───────────────
  const sessionCountMap: Record<string, number> = {};
  for (const s of allSessions) {
    sessionCountMap[s.child_id] = (sessionCountMap[s.child_id] ?? 0) + 1;
  }

  // Recent 20 children
  const recentChildren = children.slice(0, 20);

  // ─── Render ──────────────────────────────────────────────────────

  if (totalChildren === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome, {adminProfile.display_name}</p>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">No children yet</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            When parents add children and they complete sessions, aggregate data will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome, {adminProfile.display_name}</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Children", value: totalChildren, icon: (
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          )},
          { label: "Sessions Completed", value: totalSessions, icon: (
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )},
          { label: "Items Answered", value: totalItems, icon: (
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          )},
          { label: "Active This Week", value: activeThisWeek, icon: (
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          )},
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                {icon}
              </div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Charts Row: Age Band + Aptitude + Appetite */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Demographic Breakdown: Age Band Bar Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-base mb-4">Children by Age Band</h2>
          {Object.values(ageBandCounts).every((v) => v === 0) ? (
            <p className="text-sm text-gray-400">No age band data yet.</p>
          ) : (
            <div className="space-y-3">
              {AGE_BAND_ORDER.map((band) => {
                const count = ageBandCounts[band];
                const pct = (count / maxAgeBand) * 100;
                return (
                  <div key={band}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Grades {AGE_BAND_LABELS[band]}</span>
                      <span className="text-gray-800 font-semibold">{count}</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all"
                        style={{ width: `${Math.max(count > 0 ? 8 : 0, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Aptitude Tier Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-base mb-4">Aptitude Tiers</h2>
          {allScores.length === 0 && totalChildren === 0 ? (
            <p className="text-sm text-gray-400">No scores yet.</p>
          ) : (
            <div className="space-y-3">
              {[...APTITUDE_TIERS, "developing" as const].map((tier) => {
                const count = aptitudeCounts[tier];
                const pct = (count / maxAptitude) * 100;
                return (
                  <div key={tier}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium capitalize">{tier.replace("_", " ")}</span>
                      <span className="text-gray-800 font-semibold">{count}</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${TIER_CHART_COLORS[tier]} rounded-full transition-all`}
                        style={{ width: `${Math.max(count > 0 ? 8 : 0, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Appetite Tier Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-base mb-4">Appetite Tiers</h2>
          {allScores.length === 0 && totalChildren === 0 ? (
            <p className="text-sm text-gray-400">No scores yet.</p>
          ) : (
            <div className="space-y-3">
              {[...APPETITE_TIERS, "developing" as const].map((tier) => {
                const count = appetiteCounts[tier];
                const pct = (count / maxAppetite) * 100;
                return (
                  <div key={tier}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium capitalize">{tier.replace("_", " ")}</span>
                      <span className="text-gray-800 font-semibold">{count}</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${TIER_CHART_COLORS[tier]} rounded-full transition-all`}
                        style={{ width: `${Math.max(count > 0 ? 8 : 0, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Domain Performance */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-base mb-4">Average Accuracy by Domain</h2>
        {Object.keys(domainStats).length === 0 ? (
          <p className="text-sm text-gray-400">No response data yet. Accuracy will appear once children complete sessions.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(DOMAIN_CONFIG).map(([key, config]) => {
              const stats = domainStats[key];
              if (!stats || stats.total === 0) {
                return (
                  <div key={key} className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-sm font-medium text-gray-500">{config.label}</p>
                    <p className="text-xs text-gray-400 mt-1">No data</p>
                  </div>
                );
              }
              const pct = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={key} className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{config.label}</span>
                    <span className="text-lg font-bold text-gray-800">{pct}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.color} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{stats.correct.toLocaleString()}/{stats.total.toLocaleString()} correct</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Children Table */}
      <div>
        <h2 className="font-semibold text-base mb-4">Recent Children</h2>
        {recentChildren.length === 0 ? (
          <p className="text-sm text-gray-400">No children have been added yet.</p>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Age Band</th>
                  <th className="px-4 py-3 font-medium">Sessions</th>
                  <th className="px-4 py-3 font-medium">Aptitude Tier</th>
                  <th className="px-4 py-3 font-medium">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentChildren.map((child) => {
                  const score = scoreMap.get(child.id);
                  const sessCount = sessionCountMap[child.id] ?? 0;
                  return (
                    <tr key={child.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/children/${child.id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          {child.display_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {child.age_band ? `Grades ${child.age_band}` : "\u2014"}
                      </td>
                      <td className="px-4 py-3">{sessCount}</td>
                      <td className="px-4 py-3">
                        {score?.aptitude_tier ? (
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${tierColor(score.aptitude_tier)}`}>
                            {score.aptitude_tier.replace("_", " ")}
                          </span>
                        ) : (
                          <span className="text-gray-400">\u2014</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(child.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
