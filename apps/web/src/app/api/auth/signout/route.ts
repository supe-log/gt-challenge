import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://main.d1ft6a4fdhj1nr.amplifyapp.com"
    : "http://localhost:3000");

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${SITE_URL}/login`, { status: 302 });
}
