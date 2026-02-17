"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrackingLinks } from "@/actions/tracking.server";
import { BarChart3, MousePointer, Globe, Monitor, Smartphone, Tablet } from "lucide-react";

export function OpportunityAnalytics({ opportunityId }: { opportunityId: string }) {
    const [links, setLinks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, [opportunityId]);

    const loadAnalytics = async () => {
        setIsLoading(true);
        const result = await getTrackingLinks(opportunityId);
        if (result.success) {
            setLinks(result.data);
        }
        setIsLoading(false);
    };

    const totalClicks = links.reduce((sum, link) => sum + (link.click_count || 0), 0);
    const activeLinks = links.filter(l => l.is_active).length;

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <MousePointer className="h-4 w-4" />
                            Total des clics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalClicks}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Sur {links.length} lien{links.length > 1 ? 's' : ''}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Liens actifs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{activeLinks}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            {links.length - activeLinks} inactif{links.length - activeLinks > 1 ? 's' : ''}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Taux de clic
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Moyenne par lien
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Statistiques détaillées</CardTitle>
                    <CardDescription>
                        Analyse des performances de vos liens de tracking
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-center text-gray-500 py-8">Chargement...</p>
                    ) : links.length === 0 ? (
                        <div className="text-center py-8">
                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Aucune donnée disponible</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Créez des liens trackables pour voir les statistiques
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {links.map((link) => (
                                <div
                                    key={link.id}
                                    className="p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-medium text-sm">
                                            {link.campaign_name || `Lien ${link.short_code}`}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {link.click_count || 0} clics
                                        </div>
                                    </div>

                                    {link.click_count > 0 && (
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${Math.min((link.click_count / totalClicks) * 100, 100)}%`
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick tips */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Conseil</h4>
                    <p className="text-sm text-blue-800">
                        Pour obtenir des statistiques plus détaillées (géolocalisation, devices, etc.),
                        activez le tracking avancé dans les paramètres de l'agence.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}