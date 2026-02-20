"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Fonction utilitaire pour créer un slug (ex: "Mon Super Projet" -> "mon-super-projet")
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export async function createProjectFromOpportunity(
    opportunity: any,
    projectData: { name: string; start_date?: string; figma_url?: string; github_url?: string; }
) {
    const supabase = await createClient();

    try {
        // 1. Générer un slug unique
        let baseSlug = slugify(projectData.name);
        let slug = baseSlug;
        let counter = 1;
        let isUnique = false;

        while (!isUnique) {
            const { data: existing } = await supabase.from("projects").select("id").eq("slug", slug).single();
            if (!existing) {
                isUnique = true;
            } else {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
        }

        // 2. Insérer le projet
        const { data: project, error } = await supabase
            .from("projects")
            .insert({
                agency_id: opportunity.agency_id,
                opportunity_id: opportunity.id,
                company_id: opportunity.company_id,
                name: projectData.name,
                description: opportunity.description, // On reprend le brief commercial
                slug: slug,
                status: 'active',
                start_date: projectData.start_date || new Date().toISOString().split('T')[0],
                figma_url: projectData.figma_url,
                github_url: projectData.github_url,
            })
            .select()
            .single();

        if (error) throw error;

        // 3. (Optionnel) Mettre l'opportunité en "Gagné" si ce n'est pas déjà fait
        if (opportunity.status !== 'won') {
            await supabase.from("opportunities").update({ status: 'won' }).eq("id", opportunity.id);
        }

        revalidatePath("/app/projects");
        revalidatePath("/app/opportunities");

        return { success: true, data: project };
    } catch (error: any) {
        console.error("Erreur création projet:", error);
        return { success: false, error: error.message };
    }
}

export async function getProjectBySlug(slug: string) {
    const supabase = await createClient();

    try {
        const { data: project, error } = await supabase
            .from("projects")
            .select(`
                *,
                company:companies(*)
            `)
            .eq("slug", slug)
            .single();

        if (error) throw error;
        return { success: true, data: project };
    } catch (error: any) {
        console.error("Erreur fetch projet:", error);
        return { success: false, error: error.message };
    }
}

export async function createTask(data: any, agencyId: string, projectId: string) {
    const supabase = await createClient();

    try {
        const { data: newTask, error } = await supabase
            .from("tasks")
            .insert({
                agency_id: agencyId,
                project_id: projectId,
                title: data.title,
                description: data.description,
                status: data.status || "todo",
                type: data.type || "feature",
                priority: data.priority || "medium",
                // assignee_id: data.assignee_id, // Si tu gères l'assignation
                // due_date: data.due_date,
            })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data: newTask };
    } catch (error: any) {
        console.error("Erreur création tâche:", error);
        return { success: false, error: error.message };
    }
}

export async function updateTaskDetails(taskId: string, data: any) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("tasks")
            .update({
                title: data.title,
                description: data.description,
                status: data.status,
                type: data.type,
                priority: data.priority,
                updated_at: new Date().toISOString()
            })
            .eq("id", taskId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Erreur mise à jour tâche:", error);
        return { success: false, error: error.message };
    }
}