import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Company } from "@/lib/validators/companies";

export const getCompanies = async (): Promise<Company[]> => {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
        .from("companies")
        .select("*");

        if (error) throw error;
     return data || [];
 }