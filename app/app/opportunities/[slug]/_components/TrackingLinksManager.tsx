"use client";

import { createTrackingLink, getTrackingLinks, toggleTrackingLink } from "@/actions/tracking.server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // Assure-toi d'avoir le composant Switch de shadcn
import { cn } from "@/lib/utils";
import { useAgency } from "@/providers/agency-provider";
import {
    Check,
    Copy,
    Link2,
    Loader2,
    Plus,
    ShieldAlert,
    ShieldCheck,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function TrackingLinksManager({ opportunityId, agencyId }: { opportunityId: string, agencyId: string }) {
    const { agency } = useAgency();
    const [links, setLinks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [campaignName, setCampaignName] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => { loadLinks(); }, [opportunityId]);

    const loadLinks = async () => {
        setIsLoading(true);
        const result = await getTrackingLinks(opportunityId);
        if (result.success) setLinks(result.data);
        setIsLoading(false);
    };

    const handleToggleStatus = async (linkId: string, currentStatus: boolean) => {
        setTogglingId(linkId);
        // On inverse le statut
        const result = await toggleTrackingLink(linkId, !currentStatus);

        if (result.success) {
            setLinks(prev => prev.map(l => l.id === linkId ? { ...l, is_active: !currentStatus } : l));
            toast.success(!currentStatus ? "Lien activé" : "Lien désactivé");
        } else {
            toast.error("Erreur lors du changement de statut");
        }
        setTogglingId(null);
    };

    const handleCreateLink = async () => {
        if (!campaignName.trim()) return toast.error("Nom de campagne requis");
        setIsCreating(true);
        const result = await createTrackingLink({
            opportunityId,
            agencyId,
            originalUrl: agency?.website || "",
            campaignName: campaignName,
        });

        if (result.success) {
            toast.success("Lien généré");
            setCampaignName("");
            setShowInput(false);
            await loadLinks();
        }
        setIsCreating(false);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Lien copié");
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!agency?.website) {
        return (
            /* ... Garder le code du state "website manquant" du message précédent ... */
            <div className="p-10 text-center border-2 border-dashed rounded-2xl">Configuration requise</div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Gestion des liens</h3>
                    <p className="text-xs text-slate-500 font-medium">Contrôlez la disponibilité de vos URLs</p>
                </div>
                {!showInput && (
                    <Button
                        onClick={() => setShowInput(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-9 px-4 text-xs font-bold transition-all"
                    >
                        <Plus className="h-4 w-4 mr-1.5" /> Créer un lien
                    </Button>
                )}
            </div>

            {/* --- ZONE DE CRÉATION --- */}
            {showInput && (
                <Card className="border-blue-100 bg-blue-50/20 shadow-none animate-in slide-in-from-top-2 duration-300 rounded-2xl">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Configuration du lien</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setShowInput(false)}>
                                <X className="h-4 w-4 text-slate-400" />
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nom de la campagne (ex: Relance J+3)"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                className="bg-white border-slate-200 rounded-xl"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateLink()}
                            />
                            <Button onClick={handleCreateLink} disabled={isCreating} className="bg-slate-900 rounded-xl px-6">
                                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Générer"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* --- LISTE DES LIENS --- */}
            <div className="space-y-4">
                {links.map((link) => {
                    const url = `${window.location.origin}/t/${link.short_code}`;
                    const isActive = link.is_active;

                    return (
                        <div
                            key={link.id}
                            className={cn(
                                "group relative bg-white border p-5 rounded-2xl transition-all duration-300",
                                isActive ? "border-slate-100 shadow-sm" : "border-slate-50 opacity-60 bg-slate-50/30 shadow-none"
                            )}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isActive ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-400"
                                        )}>
                                            <Link2 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-900 text-sm">
                                                    {link.campaign_name}
                                                </h4>
                                                {isActive ? (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] h-4">Actif</Badge>
                                                ) : (
                                                    <Badge className="bg-slate-100 text-slate-500 border-none text-[9px] h-4">Inactif</Badge>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                                {link.short_code}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[11px] font-mono text-slate-500 truncate">
                                            {url}
                                        </div>
                                        <Button
                                            variant="outline" size="icon"
                                            disabled={!isActive}
                                            className={cn(
                                                "h-9 w-9 rounded-xl transition-all",
                                                copiedId === link.id && "bg-emerald-50 border-emerald-200 text-emerald-600"
                                            )}
                                            onClick={() => copyToClipboard(url, link.id)}
                                        >
                                            {copiedId === link.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                {/* --- CONTRÔLES --- */}
                                <div className="flex items-center gap-4 pr-2">
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Statut du lien
                                        </span>
                                        <div className="flex items-center gap-3">
                                            {togglingId === link.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                                            ) : isActive ? (
                                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <ShieldAlert className="h-4 w-4 text-slate-300" />
                                            )}
                                            <Switch
                                                checked={isActive}
                                                onCheckedChange={() => handleToggleStatus(link.id, isActive)}
                                                disabled={togglingId === link.id}
                                                className="data-[state=checked]:bg-blue-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- INFO BOX --- */}
            {!links.some(l => l.is_active) && links.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2">
                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                    <p className="text-xs text-amber-700 font-medium">
                        Attention : Tous vos liens sont actuellement inactifs. Vos prospects seront redirigés vers une page d'erreur.
                    </p>
                </div>
            )}
        </div>
    );
}