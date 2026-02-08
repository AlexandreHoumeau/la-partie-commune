import { createClient } from "@/lib/supabase/server";
import { OpportunityWithCompany } from "@/lib/validators/oppotunities";

export async function getOpportunityBySlug(slug: string): Promise<OpportunityWithCompany | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("opportunities")
        .select(`
            *,
            company:companies (*)
        `)
        .eq("id", "0d12c4bc-f47c-4e08-9ec8-73247479d70b")
        .maybeSingle()


    if (error) {
        console.error("Error fetching opportunity by slug:", error);
        return null;
    }

    return data || null;
}

