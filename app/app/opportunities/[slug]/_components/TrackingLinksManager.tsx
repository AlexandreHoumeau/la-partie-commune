"use client";

import { createTrackingLink, getTrackingLinks, toggleTrackingLink } from "@/actions/tracking.server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAgency } from "@/providers/agency-provider";
import {
    Activity,
    Check,
    CheckCircle2,
    Copy,
    Link2,
    Loader2,
    Plus,
    ShieldAlert,
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
            toast.success("Lien généré avec succès");
            setCampaignName("");
            setShowInput(false);
            await loadLinks();
        }
        setIsCreating(false);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Lien copié dans le presse-papier");
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!agency?.website) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/50">
                <ShieldAlert className="h-8 w-8 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-900">Configuration requise</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Veuillez configurer le site web de votre agence dans les paramètres avant de pouvoir générer des liens de tracking.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
                <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900 tracking-tight">Liens de tracking</h3>
                    <p className="text-sm text-slate-500 font-medium">Gérez et suivez les clics de vos campagnes</p>
                </div>
                {!showInput && (
                    <Button
                        onClick={() => setShowInput(true)}
                        size="sm"
                        className="bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 transition-all duration-300 rounded-xl"
                    >
                        <Plus className="h-4 w-4 mr-1.5" /> Créer un lien
                    </Button>
                )}
            </div>

            {/* --- ZONE DE CRÉATION --- */}
            {showInput && (
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 shadow-sm animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                            Nouveau lien de tracking
                        </span>
                        <button 
                            onClick={() => setShowInput(false)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            autoFocus
                            placeholder="Ex: Relance J+3, Campagne Emailing Mars..."
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            className="flex-1 h-10 border-slate-200 focus:border-slate-900 focus:ring-slate-900 shadow-sm bg-white"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateLink()}
                            disabled={isCreating}
                        />
                        <Button 
                            onClick={handleCreateLink} 
                            disabled={isCreating} 
                            className="h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 shadow-md"
                        >
                            {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Link2 className="h-4 w-4 mr-2" />}
                            Générer le lien
                        </Button>
                    </div>
                </div>
            )}

            {/* --- LISTE DES LIENS --- */}
            <div className="space-y-3">
                {links.map((link) => {
                    // On simule l'URL finale
                    const url = `${window.location.origin}/t/${link.short_code}`;
                    const isActive = link.is_active;

                    return (
                        <div
                            key={link.id}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 p-5",
                                isActive 
                                    ? "border-slate-200/60 bg-white shadow-sm hover:shadow-md" 
                                    : "border-slate-200/40 bg-slate-50/50 opacity-80 hover:opacity-100"
                            )}
                        >
                            {/* Left part: Info & URL */}
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <div className={cn(
                                    "mt-0.5 p-2 rounded-xl border shrink-0 transition-colors",
                                    isActive 
                                        ? "bg-slate-50 border-slate-200 text-slate-700" 
                                        : "bg-slate-100/50 border-slate-200/50 text-slate-400"
                                )}>
                                    <Link2 className="h-4 w-4" />
                                </div>
                                
                                <div className="space-y-3 flex-1 min-w-0">
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-1">
                                            <h4 className={cn("font-medium text-sm truncate tracking-tight", isActive ? "text-slate-900" : "text-slate-600")}>
                                                {link.campaign_name}
                                            </h4>
                                            {isActive ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                                    Actif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                                    Désactivé
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                            <span>ID: {link.short_code}</span>
                                            <span>•</span>
                                            {/* Assuming you have a created_at, otherwise just remove this span */}
                                            <span>Tracking Link</span> 
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 max-w-lg">
                                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-600 truncate transition-colors group-hover:bg-slate-100/50">
                                            {url}
                                        </div>
                                        <Button
                                            variant="ghost" 
                                            size="sm"
                                            disabled={!isActive}
                                            className={cn(
                                                "h-8 w-8 p-0 rounded-lg border border-transparent transition-all shrink-0",
                                                copiedId === link.id 
                                                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600" 
                                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200"
                                            )}
                                            onClick={() => copyToClipboard(url, link.id)}
                                        >
                                            {copiedId === link.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Right part: Controls */}
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                    Accès
                                </span>
                                <div className="flex items-center gap-3">
                                    {togglingId === link.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                                    ) : isActive ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <ShieldAlert className="h-4 w-4 text-slate-300" />
                                    )}
                                    <Switch
                                        checked={isActive}
                                        onCheckedChange={() => handleToggleStatus(link.id, isActive)}
                                        disabled={togglingId === link.id}
                                        className="data-[state=checked]:bg-slate-900"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {!isLoading && links.length === 0 && !showInput && (
                    <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/50">
                        <Activity className="h-8 w-8 text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-900">Aucun lien actif</p>
                        <p className="text-xs text-slate-500 mt-1">Créez votre premier lien de tracking pour analyser l'engagement.</p>
                    </div>
                )}
            </div>

            {/* --- INFO BOX --- */}
            {!isLoading && links.length > 0 && !links.some(l => l.is_active) && (
                <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-bottom-2 mt-6">
                    <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800 tracking-tight">
                            Tous les liens sont désactivés
                        </p>
                        <p className="text-xs text-amber-700/80 font-medium mt-0.5 leading-relaxed">
                            Vos prospects cliquant sur ces URLs seront redirigés vers une page d'erreur. Réactivez-les pour rétablir la redirection.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}