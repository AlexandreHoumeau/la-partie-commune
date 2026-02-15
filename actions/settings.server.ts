'use server'

import { createClient } from '@/lib/supabase/server'
import { SettingsData } from '@/lib/validators/settings'

export async function fetchSettingsData(): Promise<SettingsData> {
    const supabase = await createClient()

    // 1️⃣ Get authenticated user
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('Not authenticated')
    }

    // 2️⃣ Get profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        throw new Error('Profile not found')
    }
    let agency = null
    let team: any[] = []

    // 3️⃣ If user has agency
    if (profile.agency_id) {
        const { data: agencyData } = await supabase
            .from('agencies')
            .select('*')
            .eq('id', profile.agency_id)
            .single()

        agency = agencyData
        console.log("Fetched agency:", agency)
        // 4️⃣ Fetch agency members
        const { data: members } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, role')
            .eq('agency_id', profile.agency_id)

        team = members || []
    }

    return {
        profile,
        agency,
        team,
        ai: null,
        tracking: null,
        billing: null
    }
}
