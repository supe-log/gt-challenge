import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { thetaToLabel, tierColor, SIGNAL_DISPLAY } from "@/lib/scoring";
import { PrintButton } from "./print-button";

const DOMAIN_CONFIG: Record<string, { label: string; color: string }> = {
  reasoning: { label: "Reasoning", color: "#8b5cf6" },
  math: { label: "Math", color: "#3b82f6" },
  verbal: { label: "Verbal", color: "#10b981" },
  pattern_recognition: { label: "Patterns", color: "#f59e0b" },
};

const SIGNAL_LABELS: Record<string, string> = {
  return_visit: "Return Visits",
  persistence: "Persistence",
  voluntary_hard: "Bonus Rounds",
  learning_velocity: "Learning Speed",
  time_investment: "Time Invested",
  streak: "Consistency",
};

export default async function ReportPage({
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

  // Get domain-level performance from responses
  const { data: responses } = await supabase
    .from("responses")
    .select("item_id, is_correct")
    .eq("child_id", childId)
    .not("is_correct", "is", null);

  const responseItemIds = responses?.map((r) => r.item_id) ?? [];
  let domainStats: Record<string, { correct: number; total: number }> = {};
  if (responseItemIds.length > 0) {
    const { data: items } = await supabase
      .from("items")
      .select("id, domain")
      .in("id", responseItemIds);

    const itemDomainMap = new Map<string, string>();
    for (const item of items ?? []) {
      itemDomainMap.set(item.id, item.domain);
    }

    for (const r of responses ?? []) {
      const domain = itemDomainMap.get(r.item_id);
      if (!domain) continue;
      if (!domainStats[domain]) domainStats[domain] = { correct: 0, total: 0 };
      domainStats[domain].total++;
      if (r.is_correct) domainStats[domain].correct++;
    }
  }

  const completedSessions = sessions?.filter((s) => s.status === "completed") ?? [];
  const allSessions = sessions ?? [];

  // Deduplicate signals (keep most recent per type)
  const latestSignals = new Map<string, { signal_type: string; signal_value: number }>();
  for (const signal of appetiteSignals ?? []) {
    if (!latestSignals.has(signal.signal_type)) {
      latestSignals.set(signal.signal_type, signal);
    }
  }

  const totalItems = completedSessions.reduce((sum, s) => sum + s.items_attempted, 0);
  const totalCorrect = completedSessions.reduce((sum, s) => sum + s.items_correct, 0);
  const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0);

  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Sorted sessions for chart (ascending order)
  const chartSessions = [...completedSessions]
    .filter((s) => s.terminal_theta !== null)
    .sort((a, b) => a.session_number - b.session_number);

  // Theta interpretation
  function thetaInterpretation(theta: number): string {
    if (theta >= 1.5)
      return "This score places the student in the exceptional range, indicating cognitive performance well above age-level expectations. This level of performance is typically associated with students who would benefit from significantly accelerated or enriched curriculum.";
    if (theta >= 0.75)
      return "This score places the student in the very high range, indicating strong cognitive performance above age-level expectations. Students at this level typically benefit from advanced learning opportunities and enrichment activities.";
    if (theta >= 0)
      return "This score places the student in the high range, indicating solid cognitive performance at or above age-level expectations. Continued challenge and engagement will support further growth.";
    if (theta >= -0.75)
      return "This score places the student in the average range, indicating cognitive performance consistent with age-level expectations. With practice and exposure, growth is expected.";
    return "This score indicates the student is still developing in this area. Continued practice and support will help build foundational skills.";
  }

  return (
    <>
      <style>{`
        @media print {
          header, footer, nav, .print-hidden {
            display: none !important;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          main {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .report-page {
            padding: 0 !important;
          }
          .report-section {
            page-break-inside: avoid;
          }
          .report-table {
            page-break-inside: auto;
          }
          .report-table tr {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="report-page max-w-3xl mx-auto">
        {/* Print Button */}
        <div className="print-hidden mb-6 flex items-center justify-between">
          <a
            href={`/parent/children/${childId}`}
            className="text-sm text-indigo-600 hover:underline"
          >
            &larr; Back to profile
          </a>
          <PrintButton />
        </div>

        {/* Report Header */}
        <div className="report-section border-b-2 border-gray-800 pb-4 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                GT Challenge Assessment Report
              </h1>
              <p className="text-sm text-gray-500 mt-1">Gifted and Talented Identification Profile</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Report generated</p>
              <p className="font-medium text-gray-700">{reportDate}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Student</p>
              <p className="font-semibold text-gray-900">{child.display_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Grade Band</p>
              <p className="font-semibold text-gray-900">
                {child.age_band ? `Grades ${child.age_band}` : "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Sessions Completed</p>
              <p className="font-semibold text-gray-900">{completedSessions.length}</p>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        {score && score.aptitude_theta !== null ? (
          <div className="report-section mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Assessment Summary
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Aptitude Summary */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Aptitude (Cognitive Ability)
                </h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {thetaToLabel(score.aptitude_theta)}
                  </span>
                </div>
                {score.aptitude_tier && (
                  <p className="text-sm text-gray-600 mb-2">
                    Tier: <span className="font-medium capitalize">{score.aptitude_tier.replace("_", " ")}</span>
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Based on {score.sessions_completed} session{score.sessions_completed !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Appetite Summary */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Appetite (Learning Drive)
                </h3>
                {score.appetite_score !== null ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-extrabold text-gray-900">
                        {Math.round(score.appetite_score * 100)}%
                      </span>
                    </div>
                    {score.appetite_tier && (
                      <p className="text-sm text-gray-600 mb-2">
                        Tier: <span className="font-medium capitalize">{score.appetite_tier.replace("_", " ")}</span>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Requires additional sessions to compute.</p>
                )}
                <p className="text-sm text-gray-600">
                  Measures intrinsic motivation and persistence
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="report-section mb-8 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-500">
              No assessment scores available yet. Complete at least one session to generate score data.
            </p>
          </div>
        )}

        {/* Aptitude Details */}
        {score && score.aptitude_theta !== null && (
          <div className="report-section mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Aptitude Details
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Ability Estimate (Theta)</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {score.aptitude_theta.toFixed(2)}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Standard Error</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {score.aptitude_se !== null ? `+/- ${score.aptitude_se.toFixed(2)}` : "N/A"}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Classification</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {thetaToLabel(score.aptitude_theta)}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
              <p className="font-medium text-gray-900 mb-1">Interpretation</p>
              <p>{thetaInterpretation(score.aptitude_theta)}</p>
            </div>
            {score.sessions_completed < 2 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg mt-3">
                Note: A minimum of 2 sessions is recommended for a reliable score estimate.
              </p>
            )}
          </div>
        )}

        {/* Appetite Signals */}
        {latestSignals.size > 0 && (
          <div className="report-section mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Appetite Signals
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Appetite measures a student&apos;s intrinsic learning drive through six behavioral signals observed during assessment sessions.
            </p>
            <div className="space-y-3">
              {SIGNAL_DISPLAY.map(({ key, label }) => {
                const signal = latestSignals.get(key);
                const value = signal?.signal_value ?? 0;
                const pct = Math.round(value * 100);
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-32 shrink-0">{label}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-700 rounded-full"
                        style={{ width: `${Math.max(2, pct)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Domain Breakdown */}
        {Object.keys(domainStats).length > 0 && (
          <div className="report-section mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Performance by Domain
            </h2>
            <div className="space-y-3">
              {Object.entries(DOMAIN_CONFIG).map(([key, config]) => {
                const stats = domainStats[key];
                if (!stats || stats.total === 0) return null;
                const pct = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-32 shrink-0">{config.label}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: config.color }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                      {pct}% ({stats.correct}/{stats.total})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Session History */}
        {allSessions.length > 0 && (
          <div className="report-section mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Session History
            </h2>
            <table className="report-table w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 pr-3 font-semibold text-gray-700">Session</th>
                  <th className="text-left py-2 pr-3 font-semibold text-gray-700">Date</th>
                  <th className="text-right py-2 pr-3 font-semibold text-gray-700">Items</th>
                  <th className="text-right py-2 pr-3 font-semibold text-gray-700">Accuracy</th>
                  <th className="text-right py-2 pr-3 font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-2 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {allSessions
                  .slice()
                  .sort((a, b) => a.session_number - b.session_number)
                  .map((s) => (
                    <tr key={s.id} className="border-b border-gray-100">
                      <td className="py-2 pr-3 font-medium">#{s.session_number}</td>
                      <td className="py-2 pr-3 text-gray-600">
                        {new Date(s.started_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-2 pr-3 text-right">{s.items_attempted}</td>
                      <td className="py-2 pr-3 text-right">
                        {s.items_attempted > 0
                          ? `${Math.round((s.items_correct / s.items_attempted) * 100)}%`
                          : "--"}
                      </td>
                      <td className="py-2 pr-3 text-right text-gray-600">
                        {s.duration_seconds
                          ? `${Math.floor(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s`
                          : "--"}
                      </td>
                      <td className="py-2 capitalize text-gray-600">{s.status}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 font-semibold">
                  <td className="py-2 pr-3">Total</td>
                  <td className="py-2 pr-3"></td>
                  <td className="py-2 pr-3 text-right">{totalItems}</td>
                  <td className="py-2 pr-3 text-right">
                    {totalItems > 0 ? `${Math.round((totalCorrect / totalItems) * 100)}%` : "--"}
                  </td>
                  <td className="py-2 pr-3 text-right text-gray-600">
                    {totalDuration > 0 ? `${Math.round(totalDuration / 60)}m` : "--"}
                  </td>
                  <td className="py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Theta Progression Chart */}
        {chartSessions.length >= 2 && (
          <div className="report-section mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Ability Estimate Progression
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Theta (ability estimate) tracked across completed sessions. Higher values indicate stronger demonstrated ability.
            </p>
            <div className="border border-gray-200 rounded-lg p-4">
              <svg viewBox="0 0 500 160" className="w-full" style={{ maxHeight: "200px" }}>
                {/* Y-axis labels */}
                <text x="30" y="18" textAnchor="end" fontSize="10" fill="#9ca3af">+3.0</text>
                <text x="30" y="55" textAnchor="end" fontSize="10" fill="#9ca3af">+1.5</text>
                <text x="30" y="90" textAnchor="end" fontSize="10" fill="#9ca3af"> 0.0</text>
                <text x="30" y="125" textAnchor="end" fontSize="10" fill="#9ca3af">-1.5</text>
                <text x="30" y="155" textAnchor="end" fontSize="10" fill="#9ca3af">-3.0</text>

                {/* Grid lines */}
                <line x1="40" y1="15" x2="490" y2="15" stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1="40" y1="52" x2="490" y2="52" stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1="40" y1="87" x2="490" y2="87" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="40" y1="122" x2="490" y2="122" stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1="40" y1="152" x2="490" y2="152" stroke="#e5e7eb" strokeWidth="0.5" />

                {/* Data line */}
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartSessions
                    .map((s, i) => {
                      const x = chartSessions.length === 1
                        ? 265
                        : 50 + (i / (chartSessions.length - 1)) * 430;
                      const theta = s.terminal_theta ?? 0;
                      const y = 152 - ((theta + 3) / 6) * 140;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {/* Data points with labels */}
                {chartSessions.map((s, i) => {
                  const x = chartSessions.length === 1
                    ? 265
                    : 50 + (i / (chartSessions.length - 1)) * 430;
                  const theta = s.terminal_theta ?? 0;
                  const y = 152 - ((theta + 3) / 6) * 140;
                  return (
                    <g key={s.id}>
                      <circle cx={x} cy={y} r="4" fill="#4f46e5" stroke="white" strokeWidth="2" />
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#374151"
                        fontWeight="600"
                      >
                        {theta.toFixed(2)}
                      </text>
                      <text
                        x={x}
                        y="168"
                        textAnchor="middle"
                        fontSize="9"
                        fill="#9ca3af"
                      >
                        S{s.session_number}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* About GT Challenge */}
        <div className="report-section mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            About This Assessment
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed space-y-3">
            <p>
              GT Challenge is an adaptive gifted and talented identification platform that uses Item Response Theory (IRT)
              with a 3-Parameter Logistic model to precisely measure cognitive ability. Unlike fixed-length tests,
              GT Challenge adapts in real time to each student&apos;s performance, selecting items calibrated to their
              demonstrated ability level. This provides a more accurate and efficient measurement than traditional
              assessments.
            </p>
            <p>
              The platform uniquely measures both <strong>aptitude</strong> (cognitive ability) and <strong>appetite</strong>
              (learning drive). Aptitude is computed using Expected A Posteriori (EAP) estimation across multiple sessions,
              building an increasingly precise ability estimate. Appetite is measured through six behavioral signals --
              return visits, persistence through difficulty, voluntary challenge-seeking, learning velocity, time
              investment, and consistency -- providing a holistic picture of a student&apos;s intellectual engagement.
            </p>
            <p>
              Scores become more reliable with additional sessions. A minimum of 2 sessions is recommended for
              aptitude estimates, and 3 or more sessions are needed for appetite signals to emerge.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="report-section border-t-2 border-gray-800 pt-4 mt-8 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>GT Challenge Assessment Report -- {child.display_name}</span>
            <span>Generated {reportDate}</span>
          </div>
          <p className="mt-2">
            This report is generated from data collected during GT Challenge adaptive assessment sessions.
            It is intended for informational purposes and should be considered alongside other assessments
            and observations when making educational placement decisions.
          </p>
        </div>
      </div>
    </>
  );
}
