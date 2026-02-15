// get users profile from agency_id in session and return it to client
"use server"

import { createClient } from "@/lib/supabase/server";
import { UpdateAgencyInput } from "@/lib/validators/agency";


export async function listAgencyMembers(agencyId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email, role")
        .eq("agency_id", agencyId);

    if (error) {
        console.error("Error fetching agency members:", error);
        return [];
    }

    return data || [];
}

export async function updateAgencyInformation(agencyData: UpdateAgencyInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("agencies")
        .update(agencyData)
        .eq("id", agencyData.agency_id)
        .select()
        .single();

    if (error) {
        console.error("Error updating agency information:", error);
        throw error;
    }

    return data;
}