import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify the user has admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/parent");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-base sm:text-lg font-bold">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              GT Challenge Admin
            </span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6 text-sm">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 hidden sm:inline">
              Dashboard
            </Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-gray-500 hover:text-gray-700 transition-colors">
                Sign Out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        {children}
      </main>
      <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GT Challenge Admin</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-gray-600 transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
