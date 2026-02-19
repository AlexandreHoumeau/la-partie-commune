"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreateTrackingLinkInput = {
    opportunityId: string;
    agencyId: string;
    originalUrl: string;
    campaignName?: string;
    expiresAt?: Date;
};

export async function createTrackingLink(input: CreateTrackingLinkInput) {
    const supabase = await createClient();

    try {
        // Générer un short code unique
        const { data: shortCodeData } = await supabase.rpc('generate_short_code');
        const shortCode = shortCodeData as string;

        const { data, error } = await supabase
            .from("tracking_links")
            .insert({
                opportunity_id: input.opportunityId,
                agency_id: input.agencyId,
                short_code: shortCode,
                original_url: input.originalUrl,
                campaign_name: input.campaignName,
                expires_at: input.expiresAt?.toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating tracking link:", error);
            return { success: false, error: error.message };
        }

        revalidatePath(`/opportunities/${input.opportunityId}`);

        return {
            success: true,
            data,
            trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/t/${shortCode}`
        };
    } catch (error) {
        console.error("Error creating tracking link:", error);
        return { success: false, error: "Une erreur est survenue" };
    }
}

export async function getTrackingLinks(opportunityId: string) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("tracking_links")
            .select("*")
            .eq("opportunity_id", opportunityId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching tracking links:", error);
            return { success: false, error: error.message, data: [] };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        console.error("Error fetching tracking links:", error);
        return { success: false, error: "Une erreur est survenue", data: [] };
    }
}

export async function getTrackingLinkAnalytics(opportunityId: string) {
    const supabase = await createClient();

    try {
        // 1. Récupérer TOUS les liens de l'opportunité
        const { data: links, error: linkError } = await supabase
            .from("tracking_links")
            .select("*")
            .eq("opportunity_id", opportunityId);

        if (linkError) throw linkError;
        if (!links || links.length === 0) return { success: false, error: "Aucun lien trouvé" };

        const linkIds = links.map(l => l.id);

        // 2. Récupérer TOUS les clics pour ces liens
        const { data: clicks, error: clicksError } = await supabase
            .from("tracking_clicks")
            .select("*")
            .in("tracking_link_id", linkIds)
            .order("clicked_at", { ascending: false });

        if (clicksError) throw clicksError;

        // 3. Calculs agrégés
        const totalClicks = clicks?.length || 0;
        const uniqueIPs = new Set(clicks?.map(c => c.ip_address)).size;

        const deviceBreakdown = clicks?.reduce((acc, click) => {
            const device = click.device_type || 'unknown';
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const countryBreakdown = clicks?.reduce((acc, click) => {
            const country = click.country_code || 'unknown';
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Trouver la date du dernier clic parmi tous les liens
        const lastClickedAt = links.reduce((latest, current) => {
            if (!current.last_clicked_at) return latest;
            if (!latest) return current.last_clicked_at;
            return new Date(current.last_clicked_at) > new Date(latest)
                ? current.last_clicked_at
                : latest;
        }, null as string | null);

        return {
            success: true,
            data: {
                links, // On renvoie la liste complète
                clicks: clicks || [],
                analytics: {
                    totalClicks,
                    uniqueClicks: uniqueIPs,
                    deviceBreakdown,
                    countryBreakdown,
                    lastClickedAt,
                    activeLinksCount: links.filter(l => l.is_active).length
                }
            }
        };
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return { success: false, error: "Une erreur est survenue" };
    }
}

export async function toggleTrackingLink(linkId: string, isActive: boolean) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("tracking_links")
            .update({ is_active: isActive })
            .eq("id", linkId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error("Error toggling link:", error);
        return { success: false, error: "Une erreur est survenue" };
    }
}
