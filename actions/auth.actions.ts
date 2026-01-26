// src/app/actions/auth.ts
'use server';

import { createClient } from "@/lib/supabase/server";

type SignupInput = {
    email: string;
    password: string;
    agencyName: string;
    firstName: string;
    lastName: string;
};

export async function signup(data: SignupInput) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            data: {
                agency_name: data.agencyName,
                first_name: data.firstName,
                last_name: data.lastName,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
