import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ChildDetailPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get child profile
  const { data: child } = await supabase
    .from("profiles")
    .select("id, display_name, age_band, created_at")
    .eq("id", childId)
    .single();

  if (!child) redirect("/parent");

  // Get sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, session_number, status, items_attempted, items_correct, terminal_theta, started_at, duration_seconds, voluntary_bonus_rounds")
    .eq("child_id", childId)
    .order("session_number", { ascending: false });

  // Get composite score
  const { data: score } = await supabase
    .from("composite_scores")
    .select("aptitude_theta, aptitude_se, aptitude_tier, appetite_score, appetite_tier, sessions_completed, proctor_eligible, computed_at")
    .eq("child_id", childId)
    .single();

  // Get appetite signals
  const { data: appetiteSignals } = await supabase
    .from("appetite_signals")
    .select("signal_type, signal_value, computed_at")
    .eq("child_id", childId)
    .order("computed_at", { ascending: false });

  // Deduplicate signals (keep most recent per type)
  const latestSignals = new Map<string, { signal_type: string; signal_value: number }>();
  for (const signal of appetiteSignals ?? []) {
    if (!latestSignals.has(signal.signal_type)) {
      latestSignals.set(signal.signal_type, signal);
    }
  }

  const completedSessions = sessions?.filter((s) => s.status === "completed") ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/parent" className="text-sm text-blue-600 hover:underline mb-2 block">
            &larr; Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold">{child.display_name}</h1>
          <p className="text-gray-500">Age band: {child.age_band}</p>
        </div>
        <Link
          href={`/session/new?child=${childId}`}
          className="inline-block text-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-colors"
        >
          Start New Challenge
        </Link>
      </div>

      {/* Score Summary — Aptitude + Appetite side by side */}
      {score && score.aptitude_theta !== null ? (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Aptitude Card */}
          <div className="rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <h2 className="font-semibold text-lg">Aptitude</h2>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {thetaToLabel(score.aptitude_theta)}
              </span>
              {score.aptitude_tier && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tierColor(score.aptitude_tier)}`}>
                  {score.aptitude_tier.replace("_", " ")}
                </span>
              )}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all"
                style={{ width: `${Math.max(5, ((score.aptitude_theta + 3) / 6) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{score.sessions_completed} sessions</span>
              <span>Updated {new Date(score.computed_at).toLocaleDateString()}</span>
            </div>
            {score.sessions_completed < 2 && (
              <p className="text-xs text-amber-600">
                Complete at least 2 sessions for a reliable score.
              </p>
            )}
          </div>

          {/* Appetite Card */}
          <div className="rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <h2 className="font-semibold text-lg">Appetite</h2>
            </div>
            {score.appetite_score !== null ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {Math.round(score.appetite_score * 100)}%
                  </span>
                  {score.appetite_tier && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tierColor(score.appetite_tier)}`}>
                      {score.appetite_tier.replace("_", " ")}
                    </span>
                  )}
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                    style={{ width: `${Math.max(5, score.appetite_score * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">Needs more sessions to compute.</p>
            )}

            {/* Signal Breakdown */}
            {latestSignals.size > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {SIGNAL_DISPLAY.map(({ key, label, emoji }) => {
                  const signal = latestSignals.get(key);
                  const value = signal?.signal_value ?? 0;
                  return (
                    <div key={key} className="text-center">
                      <div className="text-lg">{emoji}</div>
                      <div className="text-sm font-bold">{Math.round(value * 100)}%</div>
                      <div className="text-[10px] text-gray-400 leading-tight">{label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
          No scores yet. Start a challenge to begin!
        </div>
      )}

      {/* Theta Progression — SVG Line Chart */}
      {completedSessions.length >= 2 && (
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Progress Over Sessions</h2>
          <div className="relative h-40">
            <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="60" x2="400" y2="60" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="30" x2="400" y2="30" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />

              {/* Line */}
              <polyline
                fill="none"
                stroke="url(#thetaGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={completedSessions
                  .slice()
                  .reverse()
                  .map((s, i, arr) => {
                    const x = arr.length === 1 ? 200 : (i / (arr.length - 1)) * 380 + 10;
                    const theta = s.terminal_theta ?? 0;
                    const y = 110 - ((theta + 3) / 6) * 100;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />

              {/* Points */}
              {completedSessions
                .slice()
                .reverse()
                .map((s, i, arr) => {
                  const x = arr.length === 1 ? 200 : (i / (arr.length - 1)) * 380 + 10;
                  const theta = s.terminal_theta ?? 0;
                  const y = 110 - ((theta + 3) / 6) * 100;
                  return (
                    <circle key={s.id} cx={x} cy={y} r="5" fill="#6366f1" stroke="white" strokeWidth="2" />
                  );
                })}

              <defs>
                <linearGradient id="thetaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Session labels */}
            <div className="flex justify-between mt-1">
              {completedSessions
                .slice()
                .reverse()
                .map((s) => (
                  <span key={s.id} className="text-xs text-gray-400">
                    S{s.session_number}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Session History */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Session History</h2>
        {sessions && sessions.length > 0 ? (
          <div className="rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Session</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Accuracy</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Bonus</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">#{s.session_number}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(s.started_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{s.items_attempted}</td>
                    <td className="px-4 py-3">
                      {s.items_attempted > 0
                        ? `${Math.round((s.items_correct / s.items_attempted) * 100)}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {s.duration_seconds
                        ? `${Math.floor(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {s.voluntary_bonus_rounds > 0 ? (
                        <span className="text-amber-600 font-medium">
                          {"⭐".repeat(Math.min(s.voluntary_bonus_rounds, 4))}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : s.status === "active"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No sessions yet.</p>
        )}
      </div>
    </div>
  );
}

const SIGNAL_DISPLAY = [
  { key: "return_visit", label: "Return Visits", emoji: "🔄" },
  { key: "persistence", label: "Persistence", emoji: "💪" },
  { key: "voluntary_hard", label: "Bonus Rounds", emoji: "⭐" },
  { key: "learning_velocity", label: "Learning Speed", emoji: "📈" },
  { key: "time_investment", label: "Time Invested", emoji: "⏱️" },
  { key: "streak", label: "Consistency", emoji: "🔥" },
];

function thetaToLabel(theta: number): string {
  if (theta >= 1.5) return "Exceptional";
  if (theta >= 0.75) return "Very High";
  if (theta >= 0) return "High";
  if (theta >= -0.75) return "Average";
  return "Developing";
}

function tierColor(tier: string): string {
  switch (tier) {
    case "exceptional": return "bg-purple-100 text-purple-700";
    case "very_high": return "bg-blue-100 text-blue-700";
    case "high": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-700";
  }
}
