import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-lg font-bold">
          GT Challenge
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/terms" className="text-gray-600 hover:text-gray-900">
            Terms
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-sm mb-12">
          Last updated: April 15, 2026
        </p>

        {/* COPPA Compliance */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            Children&apos;s Privacy and COPPA Compliance
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            GT Challenge is designed with children&apos;s privacy as a
            foundational principle. We comply with the Children&apos;s Online
            Privacy Protection Act (COPPA) and take the following measures:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Children are not direct users.</strong> All accounts are
                created and managed by parents or legal guardians. Children
                access the assessment through their parent&apos;s account.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Parental authentication required.</strong> A parent must
                authenticate and provide verifiable consent before any child
                data is collected.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Child PII stored separately.</strong> Personally
                identifiable information for children is stored in isolated
                database tables with additional access controls, separate from
                parent account data.
              </span>
            </li>
          </ul>
        </section>

        {/* Data Collection */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">What We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We collect only what is necessary to provide accurate assessments
            and track learning progress:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Assessment responses:</strong> answers to adaptive items
                across reasoning, math, verbal, and pattern recognition domains.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Response timing:</strong> time spent on each item,
                session duration, and engagement patterns. This data is used for
                scoring accuracy and to detect guessing behavior.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Behavioral signals:</strong> return visits, persistence
                after incorrect answers, voluntary difficulty selection, learning
                velocity, time investment, and streak data. These signals form
                the &quot;appetite&quot; component of our assessment.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Account information:</strong> parent email address, name,
                and child profile information (first name or nickname, age
                range).
              </span>
            </li>
          </ul>
        </section>

        {/* Data Storage */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">How We Store Your Data</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use industry-standard security practices to protect all data:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Infrastructure:</strong> all data is stored in Supabase
                with PostgreSQL, hosted on secure cloud infrastructure with
                encryption at rest and in transit.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Row-Level Security (RLS):</strong> database access
                policies ensure that parents can only access data belonging to
                their own children. No user can access another family&apos;s data
                through the application.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Encryption:</strong> all data is encrypted at rest using
                AES-256. All connections use TLS encryption in transit.
              </span>
            </li>
          </ul>
        </section>

        {/* Data Use */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">How We Use Your Data</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Assessment scoring:</strong> response data is used to
                calculate ability estimates (theta scores) and appetite signals
                through our IRT-based adaptive engine.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Progress tracking:</strong> cross-session data enables
                us to show parents how their child&apos;s abilities and
                engagement are developing over time.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Research (anonymized):</strong> we may use anonymized,
                aggregated data to improve our assessment models and contribute
                to educational research. Individual children are never
                identifiable in research data.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>We never sell your data.</strong> Your child&apos;s data
                is never sold, rented, or shared with third parties for
                marketing or advertising purposes.
              </span>
            </li>
          </ul>
        </section>

        {/* Parent Rights */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Your Rights as a Parent</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            You have full control over your child&apos;s data:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Access:</strong> you may request a complete copy of all
                data we hold about your child at any time.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Deletion:</strong> you may request the permanent deletion
                of your child&apos;s data. We will process deletion requests
                within 30 days.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Export:</strong> you may request an export of your
                child&apos;s assessment data in a portable format.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                <strong>Withdraw consent:</strong> you may withdraw consent for
                data collection at any time by deleting your account or
                contacting us directly.
              </span>
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about this privacy policy or wish to exercise
            any of your rights, please contact us at{" "}
            <a
              href="mailto:privacy@gtchallenge.app"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              privacy@gtchallenge.app
            </a>
            .
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-600">
            About
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
