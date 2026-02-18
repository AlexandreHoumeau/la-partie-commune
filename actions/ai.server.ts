"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type AIConfigState = {
    success?: boolean
    error?: string
    message?: string
}

export async function updateAIConfigAction(prevState: any, formData: FormData): Promise<AIConfigState> {
    const supabase = await createClient()

    // 1. Récupérer l'utilisateur et son agence
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Non authentifié" }

    const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id, role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'agency_admin') {
        return { error: "Seuls les administrateurs peuvent modifier cette configuration." }
    }

    // 2. Extraire les données du formulaire
    const agency_id = profile.agency_id
    const ai_context = formData.get('context') as string
    const key_points = formData.get('keyPoints') as string
    const tone = formData.get('tone') as string
    const custom_instructions = formData.get('instructions') as string

    // 3. Upsert dans la base de données
    const { error } = await supabase
        .from('agency_ai_configs')
        .upsert({
            agency_id,
            ai_context,
            key_points,
            tone,
            custom_instructions,
            updated_at: new Date().toISOString()
        }, { onConflict: 'agency_id' })

    if (error) {
        console.error("Error updating AI config:", error)
        return { error: "Erreur lors de la sauvegarde en base de données." }
    }

    // 4. Revalider le cache pour mettre à jour l'UI
    revalidatePath('/app/settings/ai')

    return {
        success: true,
        message: "L'intelligence artificielle de votre agence a été mise à jour !"
    }
}

/**
 * Récupère la config actuelle (utilisé par le Server Component)
 */
export async function getAIConfig(agencyId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('agency_ai_configs')
        .select('*')
        .eq('agency_id', agencyId)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = Not Found, ce qui est OK au début
        console.error("Fetch error:", error)
    }
    return data
}