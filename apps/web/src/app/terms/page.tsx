import Link from "next/link";

export default function TermsPage() {
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
          <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
            Privacy
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-gray-400 text-sm mb-12">
          Last updated: April 15, 2026
        </p>

        {/* Service Description */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">1. Service Description</h2>
          <p className="text-gray-600 leading-relaxed">
            GT Challenge (&quot;the Service&quot;) is an adaptive gifted
            assessment platform that measures cognitive ability (aptitude) and
            learning drive (appetite) through multi-session adaptive testing.
            The Service uses Item Response Theory (IRT) to deliver personalized
            assessment items and track progress across sessions. GT Challenge is
            intended for use by parents and legal guardians to assess and
            support their children&apos;s learning development.
          </p>
        </section>

        {/* Eligibility */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">2. Eligibility</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                You must be at least 18 years of age to create an account.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Parent or legal guardian accounts are required. Children access
                the assessment exclusively through their parent&apos;s account
                and under parental supervision.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                By creating an account, you represent that you are the parent or
                legal guardian of any child who will use the Service through your
                account.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </span>
            </li>
          </ul>
        </section>

        {/* Acceptable Use */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">3. Acceptable Use</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            You agree to use the Service only for its intended purpose. You may
            not:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Attempt to reverse-engineer, decompile, or extract the
                assessment algorithms, item parameters, or scoring models.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Share, publish, or distribute assessment items, questions, or
                answers in any form.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Use automated tools, bots, or scripts to interact with the
                Service.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Create multiple accounts for the same child to manipulate
                assessment results.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Use the Service for any unlawful purpose or in violation of any
                applicable laws or regulations.
              </span>
            </li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">4. Intellectual Property</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            All content, assessment items, algorithms, scoring models, software,
            and design elements of the Service are the intellectual property of
            GT Challenge and its licensors. This includes but is not limited to:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Assessment items and their calibrated psychometric parameters.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                The adaptive item selection engine and IRT scoring algorithms.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                The appetite measurement methodology and behavioral signal
                models.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                All visual design, branding, and user interface elements.
              </span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            Your use of the Service does not grant you any ownership rights in
            any of the above. You retain ownership of your personal data as
            described in our Privacy Policy.
          </p>
        </section>

        {/* Assessment Results */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            5. Assessment Results and Disclaimers
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            GT Challenge provides assessment scores and behavioral analytics
            intended to supplement, not replace, professional educational
            evaluation. Please understand that:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Results are informational and should not be used as the sole
                basis for educational placement decisions.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Assessment accuracy improves with multiple sessions. Early
                single-session results may have higher uncertainty.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                We do not guarantee that any school, district, or program will
                accept GT Challenge results for admission or placement
                purposes.
              </span>
            </li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            To the maximum extent permitted by applicable law:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                The Service is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind, whether express
                or implied.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                GT Challenge shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your
                use of or inability to use the Service.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                Our total liability for any claims arising from the Service
                shall not exceed the amount you paid us in the twelve months
                preceding the claim.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 font-bold mt-0.5">--</span>
              <span>
                We are not liable for any decisions made based on assessment
                results, including educational placement decisions.
              </span>
            </li>
          </ul>
        </section>

        {/* Modifications */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">7. Modifications</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify these Terms of Service at any time.
            Material changes will be communicated by email to the address
            associated with your account at least 30 days before they take
            effect. Your continued use of the Service after changes become
            effective constitutes acceptance of the revised terms. If you do not
            agree with the modified terms, you may delete your account before
            the effective date.
          </p>
        </section>

        {/* Termination */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">8. Termination</h2>
          <p className="text-gray-600 leading-relaxed">
            You may terminate your account at any time by contacting us or using
            the account deletion feature. We may suspend or terminate your
            access to the Service if you violate these terms, with notice where
            practicable. Upon termination, your right to use the Service ceases
            immediately. Your data will be handled in accordance with our
            Privacy Policy, and you may request data export or deletion.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">9. Governing Law</h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms shall be governed by and construed in accordance with
            the laws of the State of Texas, without regard to its conflict of
            law provisions. Any disputes arising from these terms or the
            Service shall be resolved in the courts of Travis County, Texas.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">10. Contact</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about these Terms of Service, please contact
            us at{" "}
            <a
              href="mailto:legal@gtchallenge.app"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              legal@gtchallenge.app
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
          <Link href="/privacy" className="hover:text-gray-600">
            Privacy
          </Link>
        </div>
        GT Challenge — A test you can game.
      </footer>
    </main>
  );
}
