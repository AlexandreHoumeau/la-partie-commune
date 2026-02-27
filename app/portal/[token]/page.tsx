"use client";

import { useEffect, useState, use, useRef } from "react";
import { getPortalData, submitClientContent } from "@/actions/portal.server";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Figma, Globe, CheckCircle2, ArrowRight, UploadCloud, FileType2, Image as ImageIcon, Check } from "lucide-react";

export default function ClientPortalPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<{ project: any, checklists: any[] } | null>(null);
    const [submittingId, setSubmittingId] = useState<string | null>(null);

    // États locaux pour stocker le texte ou le fichier avant envoi
    const [textInputs, setTextInputs] = useState<Record<string, string>>({});
    const [fileInputs, setFileInputs] = useState<Record<string, File | null>>({});

    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useEffect(() => {
        loadData(token);
    }, [token]);

    const loadData = async (magicToken: string) => {
        const result = await getPortalData(magicToken);
        if (result.success) setData({ project: result.project, checklists: result.checklists || [] });
        else toast.error("Lien invalide ou expiré.");
        setIsLoading(false);
    };

    const handleSubmit = async (item: any) => {
        const textContent = textInputs[item.id];
        const fileContent = fileInputs[item.id];

        if (item.expected_type === 'text' && !textContent?.trim()) return toast.error("Veuillez saisir du texte.");
        if (item.expected_type !== 'text' && !fileContent) return toast.error("Veuillez sélectionner un fichier.");

        setSubmittingId(item.id);

        const formData = new FormData();
        formData.append("expected_type", item.expected_type);
        if (textContent) formData.append("content", textContent);
        if (fileContent) formData.append("file", fileContent);

        const result = await submitClientContent(token, item.id, formData);

        setSubmittingId(null);

        if (result.success) {
            toast.success("Parfait ! Élément envoyé à l'équipe.");
            loadData(token);
        } else {
            toast.error("Erreur lors de l'envoi.");
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-slate-500 font-medium text-lg">Projet introuvable.</div>;

    const { project, checklists } = data;
    const completedItems = checklists.filter(c => c.status === 'uploaded');
    const progressPercentage = checklists.length === 0 ? 100 : Math.round((completedItems.length / checklists.length) * 100);

    const agencyName = project.agency?.name || "L'Agence";

    return (
        <div className="min-h-screen bg-[#FAFAFA] selection:bg-slate-200 font-sans pb-24">

            {/* Topbar Premium */}
            <header className="bg-white border-b border-slate-200/50 sticky top-0 z-50 backdrop-blur-xl bg-white/80">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                            {agencyName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 tracking-tight">{agencyName}</span>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                        Espace Client sécurisé
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Section Hero / Accueil */}
                <section className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{project.company?.name || "l'équipe"}</span> 👋
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Bienvenue sur votre espace de suivi. C'est ici que nous centralisons les avancées de votre projet <strong className="text-slate-700">{project.name}</strong> et les éléments dont nous avons besoin.
                    </p>
                </section>

                {/* Bloc Progression (Joli) */}
                <section className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Progression des contenus</h2>
                            <p className="text-sm text-slate-500 mt-1">Éléments fournis à {agencyName}</p>
                        </div>
                        <div className="text-3xl font-black text-slate-900">
                            {progressPercentage}%
                        </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </section>

                {/* Liens Utiles */}
                {(project.figma_url || project.deployment_url) && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.figma_url && (
                            <a href={project.figma_url} target="_blank" rel="noreferrer" className="group flex items-center p-5 bg-white rounded-3xl border border-slate-200/60 hover:border-[#F24E1E]/40 hover:shadow-lg transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-[#F24E1E]/10 flex items-center justify-center text-[#F24E1E] mr-4 shrink-0 group-hover:scale-110 transition-transform">
                                    <Figma className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-900">Maquettes Design</div>
                                    <div className="text-sm text-slate-500">Ouvrir Figma</div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#F24E1E] group-hover:translate-x-1 transition-all" />
                            </a>
                        )}
                        {project.deployment_url && (
                            <a href={project.deployment_url} target="_blank" rel="noreferrer" className="group flex items-center p-5 bg-white rounded-3xl border border-slate-200/60 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mr-4 shrink-0 group-hover:scale-110 transition-transform">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-900">Site de Test (Staging)</div>
                                    <div className="text-sm text-slate-500">Voir le résultat live</div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </a>
                        )}
                    </section>
                )}

                {/* Les Actions Requises */}
                <section className="space-y-6 pt-6 border-t border-slate-200/60">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">À vous de jouer</h2>
                        <p className="text-slate-500">Les éléments dont nous avons besoin pour avancer.</p>
                    </div>

                    {checklists.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-[2rem] border border-slate-200/60 text-slate-500">
                            Tout est à jour ! Nous n'avons besoin de rien pour l'instant. ✨
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {checklists.map((item) => {
                                const isDone = item.status === 'uploaded';
                                const Icon = item.expected_type === 'image' ? ImageIcon : (item.expected_type === 'file' ? FileType2 : FileType2);

                                return (
                                    <div key={item.id} className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-300 ${isDone ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-300 shadow-xl shadow-slate-200/40 hover:border-slate-400'}`}>

                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className={`text-lg font-bold ${isDone ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>{item.title}</h3>
                                                    {item.description && <p className="text-sm text-slate-500 mt-1">{item.description}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {!isDone ? (
                                            <div className="space-y-4">
                                                {/* ZONE TEXTE */}
                                                {item.expected_type === 'text' && (
                                                    <Textarea
                                                        placeholder="Écrivez votre contenu ici..."
                                                        value={textInputs[item.id] || ""}
                                                        onChange={(e) => setTextInputs({ ...textInputs, [item.id]: e.target.value })}
                                                        className="min-h-[120px] bg-slate-50/50 rounded-2xl resize-none border-slate-200 focus-visible:ring-slate-900 text-base p-4"
                                                    />
                                                )}

                                                {/* ZONE UPLOAD DE FICHIER (Magnifique) */}
                                                {(item.expected_type === 'image' || item.expected_type === 'file') && (
                                                    <div
                                                        onClick={() => fileInputRefs.current[item.id]?.click()}
                                                        className="relative border-2 border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 transition-colors rounded-2xl p-8 text-center cursor-pointer group"
                                                    >
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            ref={el => { fileInputRefs.current[item.id] = el }}
                                                            onChange={(e) => {
                                                                if (e.target.files?.[0]) {
                                                                    setFileInputs({ ...fileInputs, [item.id]: e.target.files[0] });
                                                                }
                                                            }}
                                                            accept={item.expected_type === 'image' ? "image/*" : ".pdf,.doc,.docx,.zip"}
                                                        />

                                                        {fileInputs[item.id] ? (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                                                <span className="font-semibold text-slate-900">{fileInputs[item.id]?.name}</span>
                                                                <span className="text-xs text-slate-500">Cliquez pour modifier</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                                                    <UploadCloud className="w-6 h-6 text-slate-400" />
                                                                </div>
                                                                <div className="font-semibold text-slate-700">Cliquez pour ajouter un fichier</div>
                                                                <div className="text-xs text-slate-400">
                                                                    {item.expected_type === 'image' ? 'PNG, JPG ou SVG' : 'PDF, DOCX ou ZIP'} (Max 5Mo)
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex justify-end pt-2">
                                                    <Button
                                                        onClick={() => handleSubmit(item)}
                                                        disabled={submittingId === item.id || (item.expected_type === 'text' ? !textInputs[item.id] : !fileInputs[item.id])}
                                                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 h-12 shadow-md transition-all active:scale-95"
                                                    >
                                                        {submittingId === item.id ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Envoyer à l'agence"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* ETAT VALIDE */
                                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                                                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                                    {item.file_url ? <UploadCloud className="w-5 h-5 text-slate-400" /> : <FileType2 className="w-5 h-5 text-slate-400" />}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Fourni par vous</div>
                                                    {item.file_url ? (
                                                        <a href={item.file_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-700 hover:text-blue-600 truncate block">
                                                            {item.client_response} (Voir le fichier)
                                                        </a>
                                                    ) : (
                                                        <p className="text-sm text-slate-700 truncate">{item.client_response}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}