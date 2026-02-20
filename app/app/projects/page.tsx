import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, FolderKanban, Globe, Github, Figma, ArrowRight, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ProjectsPage() {
    const supabase = await createClient();

    // Fetch des projets avec le nom de l'entreprise
    const { data: projects } = await supabase
        .from("projects")
        .select("*, company:companies(name)")
        .order("created_at", { ascending: false });

    // Fonction utilitaire pour le design des statuts
    const getStatusDesign = (status: string) => {
        switch (status) {
            case 'active':
                return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'En cours' };
            case 'completed':
                return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Terminé' };
            case 'archived':
                return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Archivé' };
            default:
                return { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400', label: status };
        }
    };

    return (
        <div className="w-full flex-1 p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                        <FolderKanban className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Projets</h1>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">Gérez le delivery et pilotez vos productions.</p>
                    </div>
                </div>

                <Button className="h-11 rounded-xl px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 transition-all active:scale-95 font-bold">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Projet
                </Button>
            </div>

            {/* --- GRID DES PROJETS --- */}
            {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => {
                        const statusDesign = getStatusDesign(project.status);

                        return (
                            <Link href={`/app/projects/${project.slug}`} key={project.id} className="group">
                                <div className="bg-white border border-slate-200/75 rounded-3xl p-6 h-full flex flex-col transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">

                                    {/* Top : Avatar + Status */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 font-extrabold text-lg shadow-sm">
                                            {project.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", statusDesign.bg, statusDesign.text)}>
                                            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", statusDesign.dot)} />
                                            {statusDesign.label}
                                        </div>
                                    </div>

                                    {/* Middle : Infos principales */}
                                    <div className="mb-6 flex-1">
                                        <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {project.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            <span className="truncate">{project.company?.name || "Projet interne"}</span>
                                        </div>
                                    </div>

                                    {/* Bottom : Métadonnées & Outils */}
                                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">

                                        {/* Pile d'icônes pour les liens */}
                                        <div className="flex items-center">
                                            {project.start_date && !project.figma_url && !project.github_url && !project.deployment_url && (
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(project.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </div>
                                            )}

                                            <div className="flex -space-x-2">
                                                {project.figma_url && (
                                                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center z-30 shadow-sm relative group/icon" title="Maquette Figma">
                                                        <Figma className="w-3.5 h-3.5 text-[#F24E1E]" />
                                                    </div>
                                                )}
                                                {project.github_url && (
                                                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center z-20 shadow-sm relative group/icon" title="Repository GitHub">
                                                        <Github className="w-3.5 h-3.5 text-slate-800" />
                                                    </div>
                                                )}
                                                {project.deployment_url && (
                                                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center z-10 shadow-sm relative group/icon" title="En production">
                                                        <Globe className="w-3.5 h-3.5 text-emerald-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Flèche d'action */}
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                /* --- EMPTY STATE (Design SaaS) --- */
                <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white border border-slate-200 border-dashed rounded-3xl">
                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <FolderKanban className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Aucun projet actif</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                        Commencez par convertir une opportunité gagnée ou créez un projet manuellement pour lancer votre production.
                    </p>
                    <Button className="bg-slate-900 text-white rounded-xl shadow-sm px-6">
                        Créer le premier projet
                    </Button>
                </div>
            )}
        </div>
    );
}