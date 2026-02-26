import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ code: string }> }
) {
	const { code } = await params;
	const supabase = await createClient();
	const headerList = await headers();

	// 1. Récupérer le lien
	const { data: link } = await supabase
		.from("tracking_links")
		.select("*, agencies(website)")
		.eq("short_code", code)
		.single();

	if (!link || !link.is_active) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// 2. Analyse poussée du visiteur
	const ua = headerList.get("user-agent") || "";
	const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
	const referer = headerList.get("referer") || "Direct / Email";

	// Détection simplifiée du device
	let device = "Desktop";
	if (/mobile/i.test(ua)) device = "Mobile";
	else if (/tablet/i.test(ua)) device = "Tablet";

	// Détection simplifiée de l'OS
	let os = "Autre";
	if (/windows/i.test(ua)) os = "Windows";
	else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
	else if (/android/i.test(ua)) os = "Android";
	else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";

	// 3. Enregistrement du clic enrichi
	await supabase.from("tracking_clicks").insert({
		tracking_link_id: link.id,
		ip_address: ip,
		user_agent: ua,
		device_type: device, // Assure-toi d'avoir ces colonnes en BDD
		os_type: os,         // ou stocke tout dans un jsonb "metadata"
		referer: referer
	});

	// Mise à jour du compteur global
	await supabase.rpc('increment_click_count', { link_id: link.id });

	// 4. Redirection
	const redirectUrl = link.original_url || link.agencies?.website || "/";
	return NextResponse.redirect(new URL(redirectUrl));
}