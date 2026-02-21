"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getPortalData(magicToken: string) {
    try {
        // On ajoute "agency:agencies(name)" pour récupérer le nom de l'agence !
        const { data: project, error: projectError } = await supabaseAdmin
            .from("projects")
            .select(`
                id, name, description, figma_url, deployment_url, is_portal_active, magic_token,
                company:companies(name),
                agency:agencies(name) 
            `)
            .eq("magic_token", magicToken)
            .single();

        if (projectError || !project) return { success: false, error: "Projet introuvable" };

        if (project.is_portal_active === false) {
            return { success: false, error: "L'accès à ce portail a été suspendu par l'agence." };
        }

        const { data: checklists, error: checklistError } = await supabaseAdmin
            .from("project_checklists")
            .select("*")
            .eq("project_id", project.id)
            .order("created_at", { ascending: true });

        return { success: true, project, checklists: checklists || [] };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function submitClientContent(itemId: string, formData: FormData) {
    try {
        const textContent = formData.get("content") as string;
        const file = formData.get("file") as File;
        const expectedType = formData.get("expected_type") as string;

        let fileUrl = null;
        let finalResponse = textContent || "";

        // Si le client a uploadé un fichier
        if (file && file.size > 0) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${itemId}-${Date.now()}.${fileExt}`;

            // Upload dans le bucket qu'on vient de créer
            const { error: uploadError } = await supabaseAdmin.storage
                .from("portal_uploads")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Récupérer l'URL publique
            const { data: publicUrlData } = supabaseAdmin.storage
                .from("portal_uploads")
                .getPublicUrl(fileName);

            fileUrl = publicUrlData.publicUrl;
            finalResponse = file.name; // On sauvegarde le nom du fichier comme texte
        }

        // Mise à jour de la base de données
        const { error } = await supabaseAdmin
            .from("project_checklists")
            .update({
                client_response: finalResponse,
                file_url: fileUrl,
                status: 'uploaded',
                updated_at: new Date().toISOString()
            })
            .eq("id", itemId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error("Erreur upload:", error);
        return { success: false, error: error.message };
    }
}