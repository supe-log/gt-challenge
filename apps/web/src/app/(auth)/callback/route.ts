import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // For OAuth users: ensure a parent profile exists
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_user_id", user.id)
        .eq("role", "parent")
        .single();

      if (!existingProfile) {
        // Create parent profile from OAuth metadata
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Parent";

        await supabase.from("profiles").insert({
          auth_user_id: user.id,
          role: "parent",
          display_name: displayName,
        });
      }
    }
  }

  return NextResponse.redirect(`${origin}/parent`);
}
