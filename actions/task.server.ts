"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProjectTasks(projectId: string) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("tasks")
            .select(`
                *,
                assignee:profiles(id, first_name, last_name)
            `)
            .eq("project_id", projectId)
            .order("position", { ascending: true });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error: any) {
        console.error("Erreur fetch tasks:", error);
        return { success: false, error: error.message };
    }
}

export async function updateTaskStatusAndPosition(
    taskId: string, 
    newStatus: string, 
    newPosition: number,
    // Optionnel : si tu veux réordonner les autres tâches en DB
) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("tasks")
            .update({ 
                status: newStatus,
                position: newPosition,
                updated_at: new Date().toISOString()
            })
            .eq("id", taskId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Erreur update task:", error);
        return { success: false, error: error.message };
    }
}