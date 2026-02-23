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

// Ajoute l'import de crypto en haut de ton fichier si besoin, ou utilise l'API Web native
// import { randomUUID } from "crypto"; 

export async function updateProjectSettings(projectId: string, data: any) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("projects")
            .update({
                name: data.name,
                description: data.description,
                start_date: data.start_date,
                figma_url: data.figma_url,
                github_url: data.github_url,
                deployment_url: data.deployment_url,
                updated_at: new Date().toISOString()
            })
            .eq("id", projectId);

        if (error) throw error;

        revalidatePath("/app/projects");
        return { success: true };
    } catch (error: any) {
        console.error("Erreur mise à jour projet:", error);
        return { success: false, error: error.message };
    }
}

export async function generateProjectMagicLink(projectId: string) {
    const supabase = await createClient();

    try {
        // Génère un token unique complexe (ex: "123e4567-e89b-12d3-a456-426614174000")
        const newToken = crypto.randomUUID();

        const { error } = await supabase
            .from("projects")
            .update({
                magic_token: newToken,
                updated_at: new Date().toISOString()
            })
            .eq("id", projectId);

        if (error) throw error;

        revalidatePath("/app/projects");
        return { success: true, token: newToken };
    } catch (error: any) {
        console.error("Erreur génération token:", error);
        return { success: false, error: error.message };
    }
}

// --- SECTION CHASSEUR DE CONTENUS (CHECKLIST) ---

export async function getProjectChecklists(projectId: string) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from("project_checklists")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: true });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error: any) {
        console.error("Erreur fetch checklists:", error);
        return { success: false, error: error.message };
    }
}

export async function createChecklistItem(projectId: string, data: { title: string, description?: string, expected_type: string }) {
    const supabase = await createClient();
    try {
        const { error } = await supabase
            .from("project_checklists")
            .insert({
                project_id: projectId,
                title: data.title,
                description: data.description,
                expected_type: data.expected_type,
                status: 'pending'
            });

        if (error) throw error;
        revalidatePath("/app/projects");
        return { success: true };
    } catch (error: any) {
        console.error("Erreur création checklist:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteChecklistItem(itemId: string) {
    const supabase = await createClient();
    try {
        const { error } = await supabase.from("project_checklists").delete().eq("id", itemId);
        if (error) throw error;
        revalidatePath("/app/projects");
        return { success: true };
    } catch (error: any) {
        console.error("Erreur suppression checklist:", error);
        return { success: false, error: error.message };
    }
}

export async function togglePortalStatus(projectId: string, isActive: boolean) {
    const supabase = await createClient();
    try {
        const { error } = await supabase
            .from("projects")
            .update({
                is_portal_active: isActive,
                updated_at: new Date().toISOString()
            })
            .eq("id", projectId);

        if (error) throw error;
        revalidatePath("/app/projects");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- SECTION STATISTIQUES (OVERVIEW) ---
export async function getProjectOverviewStats(projectId: string) {
    const supabase = await createClient();
    try {
        // 1. Récupérer le statut des tâches
        const { data: tasks } = await supabase
            .from('tasks')
            .select('status')
            .eq('project_id', projectId);

        // 2. Récupérer le statut de la checklist client
        const { data: checklists } = await supabase
            .from('project_checklists')
            .select('status')
            .eq('project_id', projectId);

        const totalTasks = tasks?.length || 0;
        const doneTasks = tasks?.filter(t => t.status === 'done').length || 0;

        const totalChecklist = checklists?.length || 0;
        const doneChecklist = checklists?.filter(c => c.status === 'uploaded').length || 0;

        return {
            success: true,
            stats: { totalTasks, doneTasks, totalChecklist, doneChecklist }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createProject(data: any, agencyId: string) {
    const supabase = await createClient();
    let finalCompanyId = data.companyId;

    // 1. Création de la nouvelle entreprise si demandé
    if (data.isNewCompany && data.newCompanyData?.name) {
        const { data: newCompany, error: companyError } = await supabase
            .from("companies")
            .insert({
                name: data.newCompanyData.name,
                email: data.newCompanyData.email || null,
                phone_number: data.newCompanyData.phone_number || null, // Correction du nom de colonne
                website: data.newCompanyData.website || null,
                business_sector: data.newCompanyData.business_sector || null, // Correction du nom de colonne
                agency_id: agencyId, // OBLIGATOIRE selon ton schéma
            })
            .select()
            .single();

        if (companyError) {
            console.error("Erreur création entreprise:", companyError);
            throw new Error("Erreur lors de la création de l'entreprise.");
        }
        finalCompanyId = newCompany.id;
    }

    // 2. Nettoyage du company_id pour Postgres (remplacer "none" ou "" par null)
    const validCompanyId = (finalCompanyId && finalCompanyId !== "none") ? finalCompanyId : null;

    // 3. Génération du slug du projet
    const baseSlug = data.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    // 4. Création du projet
    const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
            name: data.name,
            company_id: validCompanyId, // Sera bien un UUID ou null
            agency_id: agencyId, // On relie le projet à l'agence aussi
            slug: slug,
            status: "active",
        })
        .select()
        .single();

    if (projectError) {
        console.error("Erreur création projet:", projectError);
        throw new Error("Erreur lors de la création du projet.");
    }

    revalidatePath("/app/projects");
    return project;
}

export async function deleteProject(projectId: string): Promise<{ error?: string }> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("agency_id, role")
        .eq("id", user?.id)
        .single()

    if (profileError || !profile?.agency_id) {
        return {
            error: "Aucune agence associée à votre compte",
        }
    }

    // Check if user has permission (admin only)
    if (profile.role !== 'agency_admin') {
        return {
            error: "Vous n'avez pas les permissions pour modifier l'agence",
        }
    }

    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("agency_id", profile?.agency_id)

    if (error) {
        console.error("Error deleting project:", error)
        return { error: "Erreur lors de la suppression du projet." }
    }

    revalidatePath("/app/projects")
    return {}
}