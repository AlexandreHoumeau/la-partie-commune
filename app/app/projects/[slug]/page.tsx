"use client";
import { getProjectBySlug } from "@/actions/project.server";
import { useProject } from "@/providers/project-provider";
import { notFound } from "next/navigation";

export default async function ProjectOverviewPage({ params }: { params: { slug: string } }) {
    const project = useProject();

    if (!project) notFound();

    return (
        <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Colonne Principale (Brief / Description) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Brief du projet</h2>
                        <div className="prose prose-sm text-slate-600 max-w-none">
                            {project.description ? (
                                <p className="whitespace-pre-wrap leading-relaxed">{project.description}</p>
                            ) : (
                                <p className="italic text-slate-400">Aucune description fournie pour ce projet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Colonne Latérale (Métadonnées) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Détails</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Date de démarrage</p>
                                <p className="text-sm font-semibold text-slate-900">
                                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Non définie"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Statut</p>
                                <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">
                                    {project.status === 'active' ? 'En cours' : project.status}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}