import Link from "next/link";

const researchers = [
  {
    name: "David Lohman",
    contribution:
      "Developer of CogAT; research on cognitive abilities testing and the limitations of single-session assessments.",
  },
  {
    name: "Joseph Renzulli",
    contribution:
      "Three-Ring Conception of Giftedness: ability, creativity, and task commitment as co-equal indicators.",
  },
  {
    name: "Angela Duckworth",
    contribution:
      "Research on grit and sustained effort as predictors of achievement beyond measured intelligence.",
  },
  {
    name: "Robert Sternberg",
    contribution:
      "Triarchic Theory of Intelligence: analytical, creative, and practical intelligence as distinct capacities.",
  },
  {
    name: "Scott Peters",
    contribution:
      "Research on local norms and equitable identification practices for underrepresented gifted populations.",
  },
  {
    name: "Donna Ford",
    contribution:
      "Decades of work on racial and cultural equity in gifted education identification and programming.",
  },
  {
    name: "E. Paul Torrance",
    contribution:
      "Pioneer of creativity testing; demonstrated that creative thinking is measurable and distinct from IQ.",
  },
  {
    name: "Reuven Feuerstein",
    contribution:
      "Dynamic assessment and mediated learning: intelligence is modifiable, not fixed at birth.",
  },
  {
    name: "Jack Naglieri",
    contribution:
      "Nonverbal Ability Test (NNAT); research on reducing cultural and linguistic bias in cognitive assessment.",
  },
  {
    name: "Valerie Shute",
    contribution:
      "Stealth assessment: measuring competencies through natural task performance without disrupting the learning process.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-lg font-bold">
          GT Challenge
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/demo" className="text-gray-600 hover:text-gray-900">
            Try Demo
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-16 sm:pt-24 sm:pb-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          The Science Behind GT Challenge
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
          A research-grounded approach to gifted identification that measures
          what matters most: the intersection of cognitive ability and the drive
          to learn.
        </p>
      </section>

      {/* Why This Approach */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Why This Approach
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <p className="text-gray-600 leading-relaxed mb-4">
              Traditional gifted tests are coachable. Research consistently
              shows that targeted test preparation can shift scores by 5 to 15
              IQ-equivalent points, creating an advantage for families with
              access to expensive prep programs rather than identifying
              genuinely gifted children.
            </p>
            <p className="text-gray-600 leading-relaxed">
              GT Challenge inverts this dynamic. Instead of trying to build an
              un-gameable test (and failing, as every traditional assessment
              does), we designed a system where coaching <em>is</em> learning.
              When a child &quot;games&quot; our assessment by studying harder,
              returning voluntarily, and persisting through difficulty, they are
              demonstrating exactly the traits that predict long-term academic
              success. The only way to beat it is to become the kind of learner
              gifted programs are designed to serve.
            </p>
          </div>
        </div>
      </section>

      {/* What We Measure */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            What We Measure
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-indigo-700">
                Aptitude
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                IRT-calibrated adaptive items across four cognitive domains:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Reasoning:</strong> logical and abstract thinking
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Math:</strong> quantitative problem-solving
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Verbal:</strong> language comprehension and
                    vocabulary
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Pattern Recognition:</strong> spatial and visual
                    pattern analysis
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-purple-700">
                Appetite
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Six behavioral signals measured through what children actually
                do, not what they say:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Return visits:</strong> voluntary re-engagement
                    across sessions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Persistence:</strong> continued effort after
                    incorrect answers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Voluntary difficulty:</strong> opting into harder
                    challenges
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Learning velocity:</strong> rate of improvement
                    across sessions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Time investment:</strong> sustained engagement
                    duration
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold mt-0.5">
                    --
                  </span>
                  <span>
                    <strong>Streak:</strong> consistency of participation over
                    time
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">How It Works</h2>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
            <p className="text-indigo-100 leading-relaxed mb-8">
              GT Challenge uses multi-session adaptive testing to build a
              reliable, comprehensive picture of each child over time.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-xl p-5">
                <p className="font-bold mb-2">Adaptive Sessions</p>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Each session presents 15 to 40 items that adjust in real time
                  to the child&apos;s demonstrated ability level.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-5">
                <p className="font-bold mb-2">Cross-Session Tracking</p>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Theta (ability estimate) carries forward between sessions,
                  providing a more accurate starting point each time.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-5">
                <p className="font-bold mb-2">3PL IRT Model</p>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  The three-parameter logistic model accounts for item
                  difficulty, discrimination, and guessing probability for
                  precise measurement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Foundation */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Research Foundation
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            GT Challenge&apos;s design draws on decades of research in
            psychometrics, gifted education, and learning science. The following
            researchers have shaped the theoretical and empirical foundations of
            our approach:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {researchers.map(({ name, contribution }) => (
              <div
                key={name}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
              >
                <p className="font-bold text-gray-900 mb-1">{name}</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {contribution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <Link href="/privacy" className="hover:text-gray-600">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-gray-600">
            Terms
          </Link>
        </div>
        GT Challenge — A test you can game.
      </footer>
    </main>
  );
}
