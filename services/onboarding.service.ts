// services/onboarding.service.ts
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function bootstrapUser(invitationToken?: string | null) { // <-- On ajoute le token ici
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) return profile;

  const meta = user.user_metadata;
  let targetAgencyId = meta?.agency_id;
  let userRole = meta?.role || "agency_user";

  // --- NOUVEAU : Récupération via le Token d'invitation ---
  if (!targetAgencyId && invitationToken) {
    const { data: invite } = await supabaseAdmin
      .from('agency_invites')
      .select('agency_id, role')
      .eq('token', invitationToken)
      .single();

    if (invite) {
      targetAgencyId = invite.agency_id;
      userRole = invite.role;
    }
  }

  // --- CAS A : NOUVELLE AGENCE (OWNER) ---
  if (!targetAgencyId && meta?.agency_name) {
    const { data: agency, error: agencyError } = await supabaseAdmin
      .from("agencies")
      .insert({ name: meta.agency_name })
      .select()
      .single();

    if (agencyError) throw agencyError;

    targetAgencyId = agency.id;
    userRole = "agency_admin";
  }

  if (!targetAgencyId) {
    console.warn("Bootstrap: No agency found for user", user.id);
    return null;
  }

  // 3. Create profile
  const { data: newProfile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: user.id,
      agency_id: targetAgencyId,
      role: userRole,
      first_name: meta?.first_name || "",
      last_name: meta?.last_name || "",
      email: user.email,
    })
    .select()
    .single();

  if (profileError) throw profileError;

  return newProfile;
}