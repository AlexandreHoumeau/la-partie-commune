"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50)
        + "-" + Math.random().toString(36).substring(2, 7);
}

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

    const slug = generateSlug(agencyName.trim());

    // Step 1: Create agency (owner_id nullable — will be set after profile creation)
    const { data: agency, error: agencyError } = await supabaseAdmin
        .from("agencies")
        .insert({ name: agencyName.trim(), slug })
        .select()
        .single();

    if (agencyError || !agency) {
        console.error("[onboarding] agency insert error:", JSON.stringify(agencyError));
        throw new Error("Impossible de créer l'agence");
    }

    // Step 2: Create profile
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

    if (profileError) {
        // Rollback agency
        await supabaseAdmin.from("agencies").delete().eq("id", agency.id);
        console.error("[onboarding] profile insert error:", JSON.stringify(profileError));
        throw new Error("Impossible de créer le profil");
    }

    // Step 3: Set owner_id on agency now that profile exists
    const { error: updateError } = await supabaseAdmin
        .from("agencies")
        .update({ owner_id: user.id })
        .eq("id", agency.id);

    if (updateError) {
        console.error("[onboarding] agency owner_id update error:", JSON.stringify(updateError));
        // Non-blocking — agency and profile are created, just owner_id not set
    }

    return { success: true };
}
