// services/onboarding.service.ts
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function bootstrapUser() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // 1. Check profile (user-scoped, RLS OK)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) return profile;

  const meta = user.user_metadata;

  if (!meta?.agency_name) {
    throw new Error("Missing onboarding metadata");
  }

  // 2. Create agency (ADMIN — bypass RLS)
  const { data: agency, error: agencyError } = await supabaseAdmin
    .from("agencies")
    .insert({ name: meta.agency_name })
    .select()
    .single();

  if (agencyError) {
    console.error("Agency creation failed", agencyError);
    throw agencyError;
  }

  // 3. Create profile (ADMIN — bypass RLS)
  const { data: newProfile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: user.id,
      agency_id: agency.id,
      role: "agency_admin",
      full_name: `${meta.first_name} ${meta.last_name}`
    })
    .select()
    .single();

  if (profileError) {
    console.error("Profile creation failed", profileError);
    throw profileError;
  }

  return newProfile;
}
