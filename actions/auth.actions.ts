'use server';

import { createClient } from "@/lib/supabase/server";

type SignupInput = {
    email: string;
    password: string;
    agencyName?: string; // Optionnel maintenant
    firstName: string;
    lastName: string;
    redirectTo?: string; // Pour garder le lien d'invitation
};

export async function signup(data: SignupInput) {
    const supabase = await createClient();

    // On prépare l'URL de redirection après confirmation d'email
    // Si data.redirectTo existe (le lien /invite), on l'utilise
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUrl = data.redirectTo
        ? `${baseUrl}/auth/callback?next=${encodeURIComponent(data.redirectTo)}`
        : `${baseUrl}/auth/callback`;

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: redirectUrl,
            data: {
                // On ne passe agency_name que s'il existe
                ...(data.agencyName && { agency_name: data.agencyName }),
                first_name: data.firstName,
                last_name: data.lastName,
            },
        },
    });

    if (error) return { error: error.message };
    return { success: true };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
}

export async function resetPasswordForEmail(email: string) {
    const supabase = await createClient();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/callback?next=/auth/reset-password`,
    });
    if (error) return { error: error.message };
    return { success: true };
}

export async function updatePassword(newPassword: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { success: true };
}
