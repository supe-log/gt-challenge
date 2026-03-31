import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="max-w-2xl space-y-8">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          GT Challenge
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          A test you can game — if you love learning.
        </p>
        <p className="text-gray-500 max-w-lg mx-auto">
          An adaptive assessment that measures both how bright your child is
          and how hungry they are to learn. The only way to beat it is to
          keep coming back.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
