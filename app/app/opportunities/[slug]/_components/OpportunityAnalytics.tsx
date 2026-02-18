"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrackingLinksWithStats } from "@/actions/tracking.server"; // Note le changement de fonction
import { BarChart3, MousePointer, Globe, Eye, MailCheck } from "lucide-react";

export function OpportunityAnalytics({ opportunityId }: { opportunityId: string }) {
    const [links, setLinks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, [opportunityId]);

    const loadAnalytics = async () => {
        setIsLoading(true);
        const result = await getTrackingLinksWithStats(opportunityId);
        if (result.success) {
            setLinks(result.data);
        }
        setIsLoading(false);
    };

    const totalClicks = links.reduce((sum, link) => sum + (link.click_count || 0), 0);
    const totalOpens = links.reduce((sum, link) => sum + (link.open_count || 0), 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Carte OUVERTURES (Nouveau) */}
                <Card className="border-indigo-100 bg-indigo-50/20">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-indigo-600 flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Emails Ouverts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-indigo-900">{totalOpens}</div>
                        <p className="text-xs text-indigo-500 mt-1">Nombre total d'ouvertures</p>
                    </CardContent>
                </Card>

                {/* Carte CLICS */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <MousePointer className="h-4 w-4" />
                            Total des clics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalClicks}</div>
                        <p className="text-xs text-gray-500 mt-1">Interactions avec vos liens</p>
                    </CardContent>
                </Card>

                {/* Carte TAUX DE RÉACTION */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <MailCheck className="h-4 w-4" />
                            Réactivité
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">
                            {totalOpens > 0 ? Math.round((totalClicks / totalOpens) * 100) : 0}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Clics par rapport aux ouvertures</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance par campagne</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-center py-8">Chargement...</p>
                    ) : (
                        <div className="space-y-6">
                            {links.map((link) => (
                                <div key={link.id} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{link.campaign_name || `Lien ${link.short_code}`}</h4>
                                            <p className="text-xs text-slate-400">Créé le {new Date(link.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-4 text-sm font-medium">
                                            <span className="text-indigo-600">{link.open_count} ouvertures</span>
                                            <span className="text-blue-600">{link.click_count} clics</span>
                                        </div>
                                    </div>
                                    
                                    {/* Double barre de progression */}
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                        <div 
                                            className="bg-indigo-400 h-full border-r border-white" 
                                            style={{ width: `${totalOpens > 0 ? (link.open_count / totalOpens) * 100 : 0}%` }}
                                        />
                                        <div 
                                            className="bg-blue-500 h-full" 
                                            style={{ width: `${totalClicks > 0 ? (link.click_count / totalClicks) * 100 : 0}%` }}
                                        />
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