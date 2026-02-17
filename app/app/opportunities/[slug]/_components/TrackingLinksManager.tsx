"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Link2,
    Copy,
    ExternalLink,
    BarChart3,
    Plus,
    Eye,
    EyeOff,
    Trash2,
    QrCode
} from "lucide-react";
import { createTrackingLink, getTrackingLinks, toggleTrackingLink } from "@/actions/tracking.server";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface TrackingLinksManagerProps {
    opportunityId: string;
    agencyId: string;
    agencyWebsite?: string | null;
}

export function TrackingLinksManager({
    opportunityId,
    agencyId,
    agencyWebsite
}: TrackingLinksManagerProps) {
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
        if (result.success) {
            setLinks(result.data);
        }
        setIsLoading(false);
    };

    const handleCreateLink = async () => {
        if (!agencyWebsite) {
            toast.error("Aucune URL d'agence configurée");
            return;
        }

        setIsCreating(true);
        const result = await createTrackingLink({
            opportunityId,
            agencyId,
            originalUrl: agencyWebsite,
            campaignName: campaignName || undefined,
        });

        if (result.success && result.trackingUrl) {
            toast.success("Lien créé !");
            setCampaignName("");
            await loadLinks();
        } else {
            toast.error(result.error || "Erreur lors de la création");
        }
        setIsCreating(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Lien copié !");
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

    if (!agencyWebsite) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Aucune URL d'agence configurée</p>
                        <p className="text-sm text-gray-500">
                            Ajoutez l'URL du site web dans les paramètres de l'agence
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Create New Link Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Créer un lien trackable
                    </CardTitle>
                    <CardDescription>
                        Générez un lien unique pour tracker les clics vers votre site
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>URL de destination</Label>
                        <Input value={agencyWebsite} disabled className="bg-gray-50" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="campaign-name">
                            Nom de la campagne <span className="text-gray-400">(optionnel)</span>
                        </Label>
                        <Input
                            id="campaign-name"
                            placeholder="Ex: Email de prospection janvier 2024"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleCreateLink}
                        disabled={isCreating}
                        className="w-full"
                    >
                        {isCreating ? "Création..." : "Créer le lien"}
                    </Button>
                </CardContent>
            </Card>

            {/* Links List */}
            <Card>
                <CardHeader>
                    <CardTitle>Liens trackables ({links.length})</CardTitle>
                    <CardDescription>
                        Gérez vos liens de tracking et consultez les statistiques
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-center text-gray-500 py-8">Chargement...</p>
                    ) : links.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            Aucun lien créé pour le moment
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {links.map((link) => (
                                <div
                                    key={link.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {link.campaign_name && (
                                                    <span className="font-medium text-sm text-gray-900">
                                                        {link.campaign_name}
                                                    </span>
                                                )}
                                                <Badge variant={link.is_active ? "default" : "secondary"}>
                                                    {link.is_active ? "Actif" : "Inactif"}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                                                    {getTrackingUrl(link.short_code)}
                                                </code>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(getTrackingUrl(link.short_code))}
                                                    className="h-7 w-7 p-0"
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(getTrackingUrl(link.short_code), '_blank')}
                                                    className="h-7 w-7 p-0"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleLink(link.id, link.is_active)}
                                            >
                                                {link.is_active ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 text-sm text-gray-600 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4" />
                                            <span>{link.click_count || 0} clics</span>
                                        </div>
                                        {link.last_clicked_at && (
                                            <div className="text-xs text-gray-500">
                                                Dernier clic: {new Date(link.last_clicked_at).toLocaleDateString('fr-FR')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}