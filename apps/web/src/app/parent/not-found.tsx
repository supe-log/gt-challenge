import Link from "next/link";

export default function ParentNotFound() {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl font-extrabold">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Page not found
        </h1>
        <p className="text-gray-500 leading-relaxed">
          This page does not exist in the parent dashboard area. It may have
          been moved or removed.
        </p>
        <div className="pt-2">
          <Link
            href="/parent"
            className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
