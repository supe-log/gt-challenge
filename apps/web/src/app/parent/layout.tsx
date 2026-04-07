import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/parent" className="text-base sm:text-lg font-bold">
            GT Challenge
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link href="/parent" className="text-gray-600 hover:text-gray-900 hidden sm:inline">
              Dashboard
            </Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-gray-500 hover:text-gray-700">
                Sign Out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        {children}
      </main>
    </div>
  );
}
