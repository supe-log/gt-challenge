import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://main.d1ft6a4fdhj1nr.amplifyapp.com"
    : "http://localhost:3000");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
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

  return NextResponse.redirect(`${SITE_URL}/parent`);
}
