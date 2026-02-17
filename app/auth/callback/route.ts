import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bootstrapUser } from "@/services/onboarding.service";

// app/auth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/app";

  if (!code) return NextResponse.redirect(`${origin}/login`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    // ON EXTRAIT LE TOKEN DU PARAMÈTRE 'next'
    // next ressemble à : /invite?token=b1a8b29e...
    const nextUrl = new URL(next, origin);
    const token = nextUrl.searchParams.get("token");

    try {
      // ON PASSE LE TOKEN AU BOOTSTRAP
      await bootstrapUser(token);
    } catch (e) {
      console.error("Bootstrap failed:", e);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}