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
        .eq("slug", slug)
        .maybeSingle()


    if (error) {
        console.error("Error fetching opportunity by slug:", error);
        return null;
    }

    return data || null;
}

