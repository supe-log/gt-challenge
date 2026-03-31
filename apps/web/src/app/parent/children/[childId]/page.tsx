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
    .select("aptitude_theta, aptitude_se, sessions_completed, computed_at")
    .eq("child_id", childId)
    .single();

  const completedSessions = sessions?.filter((s) => s.status === "completed") ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/parent" className="text-sm text-blue-600 hover:underline mb-2 block">
            &larr; Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold">{child.display_name}</h1>
          <p className="text-gray-500">Age band: {child.age_band}</p>
        </div>
        <Link
          href={`/session/new?child=${childId}`}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Start New Challenge
        </Link>
      </div>

      {/* Score Summary */}
      {score && score.aptitude_theta !== null ? (
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Score Summary</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Aptitude Level</p>
              <p className="text-2xl font-bold">{thetaToLabel(score.aptitude_theta)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sessions Completed</p>
              <p className="text-2xl font-bold">{score.sessions_completed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-2xl font-bold">
                {new Date(score.computed_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {score.sessions_completed < 2 && (
            <p className="text-sm text-amber-600 mt-4">
              Complete at least 2 sessions for a reliable score.
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
          No scores yet. Start a challenge to begin!
        </div>
      )}

      {/* Theta Progression */}
      {completedSessions.length >= 2 && (
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Progress Over Sessions</h2>
          <div className="flex items-end gap-2 h-32">
            {completedSessions
              .slice()
              .reverse()
              .map((s) => {
                const theta = s.terminal_theta ?? 0;
                // Map theta (-3 to 3) to height percentage (10% to 100%)
                const heightPct = Math.max(10, Math.min(100, ((theta + 3) / 6) * 100));
                return (
                  <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-blue-500 rounded-t-md transition-all"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-xs text-gray-500">S{s.session_number}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Session History */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Session History</h2>
        {sessions && sessions.length > 0 ? (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Session</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Accuracy</th>
                  <th className="px-4 py-3 font-medium">Bonus Rounds</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((s) => (
                  <tr key={s.id}>
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
                    <td className="px-4 py-3">{s.voluntary_bonus_rounds}</td>
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

function thetaToLabel(theta: number): string {
  if (theta >= 1.5) return "Exceptional";
  if (theta >= 0.75) return "Very High";
  if (theta >= 0) return "High";
  if (theta >= -0.75) return "Average";
  return "Developing";
}
