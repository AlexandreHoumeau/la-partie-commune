"use client"

import { 
    TrendingUp, 
    Users, 
    Briefcase, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2, 
    Star, 
    Activity,
    Zap,
    Building2,
    ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 py-6">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord</h1>
                    <p className="text-slate-500 text-sm">Bienvenue, voici un aperçu de l'activité de votre agence.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 px-3 py-1">
                        Derniers 30 jours
                    </Badge>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95">
                        <Zap className="mr-2 h-4 w-4" />
                        Générer Rapport IA
                    </Button>
                </div>
            </div>

            {/* SECTION 1: TOP KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard 
                    title="Opportunités Actives" 
                    value="24" 
                    trend="+12%" 
                    icon={Briefcase} 
                    color="text-blue-600" 
                    bg="bg-blue-50" 
                />
                <KpiCard 
                    title="Taux de Conversion" 
                    value="64%" 
                    trend="+5%" 
                    icon={TrendingUp} 
                    color="text-emerald-600" 
                    bg="bg-emerald-50" 
                />
                <KpiCard 
                    title="Nouveaux Clients" 
                    value="12" 
                    trend="+2" 
                    icon={Users} 
                    color="text-amber-600" 
                    bg="bg-amber-50" 
                />
                <KpiCard 
                    title="Temps de Fermeture" 
                    value="18j" 
                    trend="-2j" 
                    icon={Clock} 
                    color="text-violet-600" 
                    bg="bg-violet-50" 
                />
            </div>

            {/* SECTION 2: ANALYTICS & AI INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Pipeline Status */}
                <Card className="lg:col-span-2 border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-50 bg-white">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-600" />
                            État du Pipeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <PipelineRow label="Premier Contact" count={12} total={24} color="bg-blue-500" />
                            <PipelineRow label="Proposition Envoyée" count={8} total={24} color="bg-amber-500" />
                            <PipelineRow label="Négociation" count={3} total={24} color="bg-violet-500" />
                            <PipelineRow label="Gagné" count={1} total={24} color="bg-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* AI Suggestions Card */}
                <Card className="border-blue-100 bg-blue-50/30 shadow-sm border-2">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-blue-900 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-blue-600" />
                            Assistant IA
                        </CardTitle>
                        <CardDescription className="text-blue-700/70">Actions prioritaires recommandées</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Opportunité Chaude</p>
                            <p className="text-sm text-slate-700">Relancer <b>ImmoLuxury SAS</b> : Proposition envoyée il y a 3 jours sans réponse.</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Analyse Marché</p>
                            <p className="text-sm text-slate-700">Le secteur "Luxe" a progressé de 15% ce mois-ci dans votre zone.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SECTION 3: RECENT ACTIVITY & HOT LEADS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Hot Leads (Favoris) */}
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            Focus Prioritaires
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                        {[
                            { name: "Villa Cap Ferret", company: "Riviera Invest", value: "2.4M€", status: "Proposition" },
                            { name: "Appartement Haussmann", company: "Famille Durand", value: "1.1M€", status: "Négociation" },
                        ].map((lead, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <Building2 className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                                        <p className="text-xs text-slate-500">{lead.company}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-blue-600">{lead.value}</p>
                                    <Badge variant="secondary" className="text-[10px] uppercase">{lead.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Roadmap / Activity */}
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-slate-400" />
                            Activité Récente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <TimelineItem 
                            label="Opportunité gagnée" 
                            desc="Hôtel Particulier - 4.5M€" 
                            time="Il y a 2h" 
                            icon={CheckCircle2} 
                            iconColor="text-emerald-500" 
                        />
                        <TimelineItem 
                            label="Nouvel email reçu" 
                            desc="Demande d'estimation - Jean Dupont" 
                            time="Il y a 4h" 
                            icon={ArrowUpRight} 
                            iconColor="text-blue-500" 
                        />
                        <div className="pt-2">
                            <Button variant="ghost" className="w-full text-slate-500 text-xs font-bold hover:text-blue-600 group">
                                VOIR TOUTE L'ACTIVITÉ
                                <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

// COMPOSANTS INTERNES POUR LA LISIBILITÉ

function KpiCard({ title, value, trend, icon: Icon, color, bg }: any) {
    return (
        <Card className="border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className={cn("p-2 rounded-lg", bg)}>
                        <Icon className={cn("h-5 w-5", color)} />
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-bold text-[10px]">
                        {trend}
                    </Badge>
                </div>
                <div className="mt-4">
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function PipelineRow({ label, count, total, color }: any) {
    const percentage = (count / total) * 100
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 uppercase tracking-tighter">{label}</span>
                <span className="text-slate-400">{count} dossiers</span>
            </div>
            <Progress value={percentage} className="h-2 bg-slate-100" /* indicatorClassName={color} */ />
        </div>
    )
}

function TimelineItem({ label, desc, time, icon: Icon, iconColor }: any) {
    return (
        <div className="flex gap-4 relative">
            <div className="relative z-10">
                <div className={cn("h-8 w-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm", iconColor)}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="flex-1 border-b border-slate-50 pb-4">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-slate-900">{label}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{time}</span>
                </div>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}