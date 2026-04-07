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
        <div className="text-6xl mb-6">🧠</div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          A test you can game — if you love learning.
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
      </section>

      {/* What we measure */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-12">
            Two things that matter
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-xl font-bold mb-2">Aptitude</h3>
              <p className="text-gray-500 leading-relaxed">
                Adaptive questions across reasoning, math, verbal, and pattern
                recognition. Items get harder as your child improves — powered by
                Item Response Theory used in professional psychometric testing.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🔥</div>
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
                emoji: "🚀",
                title: "Play a session",
                desc: "15-40 adaptive questions that adjust to your child's level in real time.",
              },
              {
                step: "2",
                emoji: "📊",
                title: "Come back for more",
                desc: "Multiple sessions wash out bad days and build a reliable picture over time.",
              },
              {
                step: "3",
                emoji: "🏆",
                title: "See the full picture",
                desc: "Parents get aptitude scores, appetite signals, and progress charts across sessions.",
              },
            ].map(({ step, emoji, title, desc }) => (
              <div key={step} className="text-center p-6">
                <div className="text-4xl mb-3">{emoji}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-3">
                  {step}
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why different */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Why GT Challenge is different
          </h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Every gifted test tries to be un-gameable — and fails. CogAT coaching
            shifts scores 5-10 percentile points. We flip this: when a child
            &quot;games&quot; our test by studying harder, persisting through difficulty, and
            coming back voluntarily, that&apos;s exactly the signal we want.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: "🔄", label: "Multi-session", detail: "5+ sessions eliminate single-test-day variance" },
              { icon: "🎯", label: "Adaptive", detail: "IRT-calibrated items optimize for each child" },
              { icon: "⚖️", label: "More equitable", detail: "Measures effort (accessible to all) not test-prep access" },
            ].map(({ icon, label, detail }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">{icon}</div>
                <p className="font-bold text-sm">{label}</p>
                <p className="text-indigo-200 text-xs mt-1">{detail}</p>
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
        <p className="text-gray-500 mb-8">Free to start. No credit card required.</p>
        <Link
          href="/signup"
          className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        GT Challenge — A test you can game.
      </footer>
    </main>
  );
}
