import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AddChildForm } from "@/components/add-child-form";

export default async function ParentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get parent profile
  const { data: parentProfile } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("auth_user_id", user.id)
    .eq("role", "parent")
    .single();

  if (!parentProfile) redirect("/login");

  // Get children
  const { data: links } = await supabase
    .from("parent_child_links")
    .select("child_id")
    .eq("parent_id", parentProfile.id);

  const childIds = links?.map((l) => l.child_id) ?? [];

  let children: { id: string; display_name: string; age_band: string | null }[] = [];
  if (childIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, age_band")
      .in("id", childIds);
    children = data ?? [];
  }

  // Get session counts per child
  const sessionCounts: Record<string, number> = {};
  if (childIds.length > 0) {
    const { data: sessions } = await supabase
      .from("sessions")
      .select("child_id")
      .in("child_id", childIds)
      .eq("status", "completed");

    for (const s of sessions ?? []) {
      sessionCounts[s.child_id] = (sessionCounts[s.child_id] ?? 0) + 1;
    }
  }

  // Get composite scores
  const scores: Record<string, { aptitude_theta: number | null; sessions_completed: number }> = {};
  if (childIds.length > 0) {
    const { data: scoreData } = await supabase
      .from("composite_scores")
      .select("child_id, aptitude_theta, sessions_completed")
      .in("child_id", childIds);

    for (const s of scoreData ?? []) {
      scores[s.child_id] = s;
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {parentProfile.display_name}</h1>
        <p className="text-gray-500 mt-1">Manage your children and track their progress.</p>
      </div>

      {children.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <h2 className="text-lg font-semibold">Add your first child</h2>
          <p className="text-gray-500 mt-1 mb-6">
            Create a profile for your child to start their GT Challenge journey.
          </p>
          <AddChildForm parentId={parentProfile.id} />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {children.map((child) => {
              const score = scores[child.id];
              const count = sessionCounts[child.id] ?? 0;
              return (
                <Link
                  key={child.id}
                  href={`/parent/children/${child.id}`}
                  className="block rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {child.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{child.display_name}</h3>
                      <p className="text-sm text-gray-500">
                        Age band: {child.age_band ?? "Not set"} &middot; {count} session{count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {score && score.aptitude_theta !== null && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        Aptitude level: <span className="font-medium">{thetaToLabel(score.aptitude_theta)}</span>
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="rounded-xl border border-dashed border-gray-300 p-6">
            <h3 className="font-semibold mb-4">Add another child</h3>
            <AddChildForm parentId={parentProfile.id} />
          </div>
        </>
      )}
    </div>
  );
}

function thetaToLabel(theta: number): string {
  if (theta >= 1.5) return "Exceptional";
  if (theta >= 0.75) return "Very High";
  if (theta >= 0) return "High";
  if (theta >= -0.75) return "Average";
  return "Developing";
}
