"use client";

import { createTrackingLink, getTrackingLinks, toggleTrackingLink } from "@/actions/tracking.server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAgency } from "@/providers/agency-provider";
import {
    ArrowRight,
    Copy,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Link2,
    MousePointerClick,
    Plus
} from "lucide-react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// --- Sous-composant Guide ---
function TrackingGuide() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-100 p-1.5 rounded-md">
                        <MousePointerClick className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-sm text-blue-900">Clics</h4>
                </div>
                <p className="text-xs text-blue-700/80 leading-relaxed">
                    Le lien est redirigé vers votre site tout en enregistrant l'appareil et la provenance du prospect.
                </p>
            </div>
            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-indigo-100 p-1.5 rounded-md">
                        <ImageIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h4 className="font-semibold text-sm text-indigo-900">Ouvertures</h4>
                </div>
                <p className="text-xs text-indigo-700/80 leading-relaxed">
                    Un pixel invisible détecte quand le prospect ouvre l'email. Idéal pour connaître le meilleur moment pour relancer.
                </p>
            </div>
        </div>
    );
}

interface TrackingLinksManagerProps {
    opportunityId: string;
    agencyId: string;
}

export function TrackingLinksManager({
    opportunityId,
    agencyId,
}: TrackingLinksManagerProps) {
    const { agency } = useAgency();
    const [links, setLinks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [campaignName, setCampaignName] = useState("");

    useEffect(() => {
        loadLinks();
    }, [opportunityId]);

    const loadLinks = async () => {
        setIsLoading(true);
        const result = await getTrackingLinks(opportunityId);
        if (result.success) setLinks(result.data);
        setIsLoading(false);
    };

    const handleCreateLink = async () => {
        if (!agency?.website) return;
        setIsCreating(true);
        const result = await createTrackingLink({
            opportunityId,
            agencyId,
            originalUrl: agency.website,
            campaignName: campaignName || undefined,
        });

        if (result.success) {
            toast.success("Lien de tracking généré");
            setCampaignName("");
            await loadLinks();
        }
        setIsCreating(false);
    };

    const copyPixelAsRichText = async (url: string) => {
    const html = `<img src="${url}?p=1" width="1" height="1" style="display:block;" alt="" />`;
    const type = "text/html";
    const blob = new Blob([html], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    try {
        await navigator.clipboard.write(data);
        toast.success("Pixel prêt à être collé dans votre mail !");
    } catch (err) {
        toast.error("Erreur lors de la copie");
    }
};

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copié !`);
    };

    
    const handleToggleLink = async (linkId: string, currentStatus: boolean) => {
        const result = await toggleTrackingLink(linkId, !currentStatus);
        if (result.success) {
            toast.success(currentStatus ? "Lien désactivé" : "Lien activé");
            await loadLinks();
        }
    };

    const getTrackingUrl = (shortCode: string) => {
        return `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/t/${shortCode}`;
    };

    if (!agency?.website) {
        return (
            <Card className="border-dashed border-2 bg-slate-50/50 border-slate-200">
                <CardContent className="pt-10 pb-10">
                    <div className="text-center max-w-sm mx-auto space-y-4">
                        <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto shadow-sm flex items-center justify-center border border-slate-100">
                            <Link2 className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Configuration requise</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                Ajoutez l'URL de votre site web dans les réglages de l'agence pour activer le tracking.
                            </p>
                        </div>
                        <NextLink href="/settings/agency">
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-4 group shadow-lg shadow-slate-200">
                                Configurer mon agence
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </NextLink>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <TrackingGuide />

            {/* Formulaire de création */}
            <Card className="border-none shadow-sm bg-white border border-slate-100">
                <CardHeader className="pb-4">
                    <CardTitle className="text-md font-bold flex items-center gap-2">
                        <div className="bg-blue-600 p-1 rounded">
                            <Plus className="h-4 w-4 text-white" />
                        </div>
                        Nouveau lien
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-700">Destination (votre site)</Label>
                            <Input value={agency.website} disabled className="bg-slate-50 border-slate-200 text-slate-500 h-9" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="campaign" className="text-xs font-semibold text-slate-700">Nom de la campagne</Label>
                            <Input
                                id="campaign"
                                placeholder="ex: Prospection LinkedIn Mars"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                className="h-9 border-slate-200 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleCreateLink}
                        disabled={isCreating}
                        className="w-full bg-blue-600 hover:bg-blue-700 h-10 font-medium"
                    >
                        {isCreating ? "Génération..." : "Générer le lien de tracking"}
                    </Button>
                </CardContent>
            </Card>

            {/* Liste des liens */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-slate-800">Liens actifs ({links.length})</h3>
                </div>

                {isLoading ? (
                    <div className="py-12 text-center text-slate-400 animate-pulse text-sm font-medium">Chargement des liens...</div>
                ) : links.length === 0 ? (
                    <Card className="border-dashed border-2 bg-slate-50/30">
                        <CardContent className="py-8 text-center">
                            <p className="text-sm text-slate-400">Aucun lien généré pour cette opportunité.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {links.map((link) => {
                            const url = getTrackingUrl(link.short_code);

                            return (
                                <Card key={link.id} className="group hover:border-blue-200 transition-all border-slate-200 shadow-none">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-slate-900">
                                                        {link.campaign_name || "Lien direct"}
                                                    </span>
                                                    <Badge variant={link.is_active ? "default" : "secondary"} className={link.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : ""}>
                                                        {link.is_active ? "Actif" : "Inactif"}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <code className="bg-slate-100 text-[11px] px-2 py-1 rounded text-slate-600 font-mono border border-slate-200">
                                                        {url}
                                                    </code>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-600" onClick={() => copyToClipboard(url, "Lien")}>
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <div className="text-center px-3 border-r border-slate-200">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Clics</p>
                                                    <p className="text-lg font-black text-slate-900">{link.click_count || 0}</p>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 text-[10px] font-bold uppercase gap-1 bg-white border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                                        onClick={() => copyPixelAsRichText(url)}
                                                    >
                                                        <ImageIcon className="h-3 w-3" /> Copier Pixel
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-[10px] font-bold uppercase gap-1 text-slate-400"
                                                        onClick={() => handleToggleLink(link.id, link.is_active)}
                                                    >
                                                        {link.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                        {link.is_active ? "Désactiver" : "Activer"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}