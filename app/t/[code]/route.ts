// app/t/[code]/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
    request: NextRequest,
    { params }: { params: { code: string } }
) {
    const { code } = await params;
    const supabase = await createClient();
    const headerList = await headers();

    // 1. Récupérer les infos du lien
    const { data: link } = await supabase
        .from("tracking_links")
        .select("*, agencies(website)")
        .eq("short_code", code)
        .single();

    if (!link || !link.is_active) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 2. Extraire les métadonnées (IP, User-Agent, etc.)
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const ua = headerList.get("user-agent") || "";

    // Détection sommaire (tu peux utiliser une lib comme 'ua-parser-js')
    const isPixel = request.nextUrl.searchParams.has("p");

    if (isPixel) {
        // --- LOGIQUE PIXEL (Ouverture) ---
        await supabase.from("tracking_opens").insert({
            tracking_link_id: link.id,
            ip_address: ip,
            user_agent: ua
        });

        // Retourner une image 1x1 transparente (PNG)
        const pixel = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            "base64"
        );
        return new NextResponse(pixel, {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });
    } else {
        // --- LOGIQUE CLIC (Redirection) ---
        const { error: tracking_clicks_error } = await supabase.from("tracking_clicks").insert({
            tracking_link_id: link.id,
            ip_address: ip,
            user_agent: ua,
            // Optionnel: ajouter city, country via une API de GeoIP ici
        });

        if (tracking_clicks_error) {
            console.error("Erreur lors de l'enregistrement du clic :", tracking_clicks_error);
        }

        // Mise à jour du lien
        const { error: tracking_links_error } = await supabase
            .from("tracking_links")
            .update({ last_clicked_at: new Date().toISOString() })
            .eq("id", link.id);

        if (tracking_links_error) {
            console.error("Erreur lors de la mise à jour du lien :", tracking_links_error);
        }

        return NextResponse.redirect(link.original_url || link.agencies?.website || "/");
    }
}