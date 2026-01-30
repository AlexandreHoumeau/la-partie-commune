import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { OpportunityFormValues, OpportunityStatus, OpportunityWithCompany } from "@/lib/validators/oppotunities";

export async function searchCompanies(query: string) {
    if (!query) return [];
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .ilike("name", `%${query}%`) // case-insensitive search
        .limit(5); // limit for performance

    if (error) throw error;
    return data || [];
}


export async function getOpportunities(): Promise<OpportunityWithCompany[]> {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
        .from("opportunities")
        .select(`
        *,
        company:companies (*)
        `)
    if (error) throw error;
    return data;
}

export async function createOpportunity(values: OpportunityFormValues, agencyId?: string) {
    const supabase = createSupabaseBrowserClient();
    console.log(values.status);
    console.log(values.contact_via);
    // 1️⃣ Create company
    const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert([
            {
                name: values.company_name,
                adress: values.company_address || null,
                email: values.company_email || null,
                phone_number: values.company_phone || null,
                website: values.company_website || null,
                business_sector: values.company_sector || null,
            },
        ])
        .select()
        .single();

    if (companyError) throw companyError;

    // 2️⃣ Create opportunity
    const { data: opportunity, error: oppError } = await supabase
        .from("opportunities")
        .insert([
            {
                agency_id: agencyId || null,
                name: values.name,
                description: values.description || null,
                status: values.status,
                contact_via: values.contact_via,
                company_id: company.id,
            },
        ])
        .select()
        .single();

    if (oppError) throw oppError;

    // 3️⃣ Optionally: add company to agency's companies array
    if (agencyId) {
        await supabase
            .from("agencies")
            .update({
                companies: supabase.rpc("array_append", ["companies", company.id]),
            })
            .eq("id", agencyId);
        // Note: if you want atomic array update, you can also handle in a transaction
    }

    return opportunity;
}

export async function updateOpportunity(id: string, payload: any) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
        .from("opportunities")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteOpportunities(ids: string[]) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
        .from("opportunities")
        .delete()
        .in("id", ids);

    if (error) throw error;
    return true;
}

// Optional: update order after drag-and-drop
export async function updateOpportunityOrder(id: string, order: number) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
        .from("opportunities")
        .update({ order })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}


export async function updateOpportunityStatus(
    opportunityId: string,
    status: OpportunityStatus
) {
    const supabase = await createSupabaseBrowserClient();

    const { error } = await supabase
        .from("opportunities")
        .update({ status })
        .eq("id", opportunityId);

    if (error) {
        throw error;
    }
}
