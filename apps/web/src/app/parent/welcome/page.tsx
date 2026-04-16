import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AddChildForm } from "@/components/add-child-form";

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: parentProfile } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("auth_user_id", user.id)
    .eq("role", "parent")
    .single();

  if (!parentProfile) redirect("/login");

  // If they already have children, skip onboarding
  const { data: links } = await supabase
    .from("parent_child_links")
    .select("id")
    .eq("parent_id", parentProfile.id)
    .limit(1);

  if (links && links.length > 0) redirect("/parent");

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-4">
      {/* Welcome header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to GT Challenge
        </h1>
        <p className="text-gray-500 text-lg">
          Let&apos;s get {parentProfile.display_name.split(" ")[0]}&apos;s child set up in just a minute.
        </p>
      </div>

      {/* How it works */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            step: "1",
            title: "Add your child",
            desc: "Create a profile with their name and age band. No account needed for kids (COPPA compliant).",
          },
          {
            step: "2",
            title: "Start a session",
            desc: "15-40 adaptive questions that adjust difficulty in real time. Takes about 10-25 minutes.",
          },
          {
            step: "3",
            title: "Watch them grow",
            desc: "Each session builds a more precise picture. We measure both cognitive ability and learning drive.",
          },
        ].map(({ step, title, desc }) => (
          <div key={step} className="text-center p-5 rounded-xl border border-gray-200 bg-white">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm mb-3">
              {step}
            </div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* What we measure */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <h3 className="font-semibold text-indigo-800 mb-2">Aptitude</h3>
          <p className="text-sm text-indigo-600/80 leading-relaxed">
            Adaptive items across reasoning, math, verbal, and pattern recognition. Powered by 3-Parameter IRT used in professional psychometric testing.
          </p>
        </div>
        <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-5">
          <h3 className="font-semibold text-orange-800 mb-2">Appetite</h3>
          <p className="text-sm text-orange-600/80 leading-relaxed">
            We measure what your child does, not what they say. Return visits, persistence, voluntary difficulty, learning speed, and consistency.
          </p>
        </div>
      </div>

      {/* Add child form */}
      <div className="rounded-2xl border-2 border-indigo-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Add your child to get started</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your child won&apos;t need their own account. You manage their profile and can view all their results.
        </p>
        <AddChildForm parentId={parentProfile.id} />
      </div>

      {/* Skip link */}
      <p className="text-center">
        <Link href="/parent" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Skip for now and go to dashboard
        </Link>
      </p>
    </div>
  );
}
