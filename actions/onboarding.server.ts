"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function completeOnboarding({
    agencyName,
    firstName,
    lastName,
}: {
    agencyName: string;
    firstName: string;
    lastName: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    // Guard: if profile already exists, skip
    const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

    if (existingProfile) return { success: true };

    // Create agency
    const { data: agency, error: agencyError } = await supabaseAdmin
        .from("agencies")
        .insert({ name: agencyName.trim() })
        .select()
        .single();

    if (agencyError || !agency) throw new Error("Impossible de créer l'agence");

    // Create profile
    const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({
            id: user.id,
            agency_id: agency.id,
            role: "agency_admin",
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: user.email,
        });

    if (profileError) throw new Error("Impossible de créer le profil");

    return { success: true };
}
