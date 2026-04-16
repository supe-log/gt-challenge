import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-lg font-bold">GT Challenge</span>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/demo" className="text-gray-600 hover:text-gray-900">
            Try Demo
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-900"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          A test you can game &mdash; if you love learning.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
          GT Challenge is an adaptive gifted assessment that measures both how
          bright your child is and how hungry they are to learn. The only way to
          beat it is to keep coming back.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/signup"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl"
          >
            Get Started Free
          </Link>
          <Link
            href="/demo"
            className="px-8 py-4 border-2 border-gray-200 rounded-2xl font-bold text-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Try the Demo
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-400">Free forever. No credit card required.</p>
      </section>

      {/* What we measure */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-12">
            Two things that matter
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Aptitude</h3>
              <p className="text-gray-500 leading-relaxed">
                Adaptive questions across reasoning, math, verbal, and pattern
                recognition. Items get harder as your child improves &mdash; powered by
                the same Item Response Theory used in professional psychometric testing.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Appetite</h3>
              <p className="text-gray-500 leading-relaxed">
                We measure what your child <em>does</em>, not what they say. Do they
                come back? Do they persist after mistakes? Do they opt into harder
                challenges? These behavioral signals predict success beyond IQ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-12">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Play a session",
                desc: "15-40 adaptive questions that adjust to your child's level in real time. Each session takes 10-25 minutes.",
              },
              {
                step: "2",
                title: "Come back for more",
                desc: "Multiple sessions wash out bad days and build a reliable picture over time. We measure how eagerly they return.",
              },
              {
                step: "3",
                title: "See the full picture",
                desc: "Parents get aptitude scores, appetite signals, and progress charts across sessions &mdash; not just a single number.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center p-6 bg-white rounded-2xl border border-gray-100">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm mb-4">
                  {step}
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">
            How we compare
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
            Traditional gifted tests try to be un-gameable and fail. GT Challenge inverts the paradigm.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Dimension</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-400">Traditional Tests</th>
                  <th className="text-left px-6 py-4 font-semibold text-indigo-600">GT Challenge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { dim: "Sessions", trad: "Single session (30-120 min)", gt: "Multiple sessions over weeks" },
                  { dim: "Coaching", trad: "Inflates scores by 5-15 IQ points", gt: "Coaching = learning (welcomed)" },
                  { dim: "What's measured", trad: "Cognitive ability only", gt: "Aptitude + appetite (behavioral)" },
                  { dim: "Precision", trad: "One-shot estimate", gt: "Rolling estimate that improves each session" },
                  { dim: "Output", trad: "Single IQ score", gt: "Multi-dimensional profile" },
                  { dim: "Cost", trad: "$5 - $3,000 per child", gt: "Free" },
                  { dim: "Equity", trad: "Selects for test-prep access", gt: "Selects for learning drive" },
                ].map(({ dim, trad, gt }) => (
                  <tr key={dim}>
                    <td className="px-6 py-3.5 font-medium text-gray-800">{dim}</td>
                    <td className="px-6 py-3.5 text-gray-400">{trad}</td>
                    <td className="px-6 py-3.5 text-gray-700 font-medium">{gt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why different - Feature deep dive */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            Why GT Challenge is different
          </h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8 leading-relaxed text-center">
            Every gifted test tries to be un-gameable &mdash; and fails. CogAT coaching
            shifts scores 5-10 percentile points. We flip this: when a child
            &quot;games&quot; our test by studying harder, persisting through difficulty, and
            coming back voluntarily, that&apos;s exactly the signal we want.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { label: "Multi-session", detail: "5+ sessions eliminate single-test-day variance. Bad days wash out." },
              { label: "Adaptive IRT", detail: "3-Parameter Logistic model adjusts difficulty in real time for each child." },
              { label: "More equitable", detail: "Measures effort and drive (accessible to all), not test-prep access (gated by wealth)." },
            ].map(({ label, detail }) => (
              <div key={label} className="bg-white/10 rounded-xl p-5">
                <p className="font-bold text-sm mb-2">{label}</p>
                <p className="text-indigo-200 text-xs leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What ages is GT Challenge designed for?",
                a: "GT Challenge supports three age bands: K-2 (ages 5-7), grades 3-5 (ages 8-10), and grades 6-8 (ages 11-14). Items are calibrated separately for each group.",
              },
              {
                q: "How long does a session take?",
                a: "Each session is 15-40 adaptive questions, typically taking 10-25 minutes. The test adapts to your child's level and stops when it has a precise enough estimate or when 40 items are reached.",
              },
              {
                q: "Is it really free?",
                a: "Yes. GT Challenge is free for all families. There are no premium tiers, no hidden fees, and no credit card required.",
              },
              {
                q: "Can my child practice before taking the real test?",
                a: "Absolutely — and we encourage it. Unlike traditional gifted tests, practicing reasoning skills IS learning. The more your child practices, the better they get. That's the whole point.",
              },
              {
                q: "How many sessions should my child complete?",
                a: "At minimum 2 sessions for a reliable aptitude estimate. We recommend 5+ sessions for the most accurate picture, as this also generates meaningful appetite (behavioral) signals.",
              },
              {
                q: "What data do you collect about my child?",
                a: "We collect assessment responses, timing data, and behavioral signals (like how often they return). Children do not have their own accounts — parents authenticate and manage access. All data is encrypted and never sold. See our privacy policy for details.",
              },
              {
                q: "How is this different from CogAT or NNAT?",
                a: "CogAT and NNAT are single-session tests where coaching inflates scores by 5-15 IQ points without improving actual ability. GT Challenge uses multiple sessions, measures behavioral drive alongside cognitive ability, and welcomes coaching because practicing reasoning IS learning.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-indigo-600 transition-colors flex items-center justify-between">
                  {q}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="px-6 pb-4 text-gray-500 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { stat: "4", label: "Cognitive domains" },
              { stat: "6", label: "Appetite signals" },
              { stat: "300+", label: "Calibrated items" },
              { stat: "3", label: "Age bands" },
            ].map(({ stat, label }) => (
              <div key={label} className="p-4">
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stat}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to discover what your child can do?
        </h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Start with a free session. No prep needed &mdash; the test meets your child where they are.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
          >
            Create Free Account
          </Link>
          <Link
            href="/demo"
            className="inline-block px-10 py-4 border-2 border-gray-200 rounded-2xl font-bold text-lg text-gray-700 hover:bg-gray-50 transition-all"
          >
            Try Demo First
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>GT Challenge &mdash; A test you can game.</span>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-gray-600 transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
