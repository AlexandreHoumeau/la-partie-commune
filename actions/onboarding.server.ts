"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

    // Step 1: Create agency WITHOUT owner_id (owner_id FK references profiles.id which doesn't exist yet)
    const { data: agency, error: agencyError } = await supabaseAdmin
        .from("agencies")
        .insert({ name: agencyName.trim(), slug })
        .select()
        .single();

    if (agencyError || !agency) {
        console.error("[onboarding] agency insert error:", JSON.stringify(agencyError));
        throw new Error("Impossible de créer l'agence");
    }

    // Step 2: Create profile (now the agency exists so agency_id FK is satisfied)
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

    // Step 3: Now that the profile exists, set owner_id on the agency
    const { error: ownerError } = await supabaseAdmin
        .from("agencies")
        .update({ owner_id: user.id })
        .eq("id", agency.id);

    if (ownerError) {
        console.error("[onboarding] agency owner_id update error:", JSON.stringify(ownerError));
        // Non-fatal: profile and agency exist, just owner_id not set
    }

    revalidatePath("/", "layout");
    redirect("/app");
}
