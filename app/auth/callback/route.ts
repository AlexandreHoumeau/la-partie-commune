import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bootstrapUser } from "@/services/onboarding.service";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login`);
  }

  try {
    await bootstrapUser();
  } catch (e) {
    console.error("Bootstrap failed:", e);
    // TODO: Handle the error appropriately (e.g., redirect to an error page)
  }

  return NextResponse.redirect(`${origin}/app`);
}
