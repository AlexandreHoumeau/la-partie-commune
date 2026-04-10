"use client";

import { useEffect, useState, use, useRef } from "react";
import Image from "next/image";
import { getPortalData, submitClientContent } from "@/actions/portal.server";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PortalUploadAccessButton } from "@/components/files/PortalUploadAccessButton";
import { getChecklistDisplayDescription, getChecklistSuggestedSections } from "@/lib/portal-checklist";
import { buildPortalResponsePreview, parsePortalClientResponse, stringifyPortalResponse, type PortalSectionBlock } from "@/lib/portal-content";
import { toast } from "sonner";
import {
    Loader2, PenTool, Globe, CheckCircle2, ArrowRight, UploadCloud,
    FileType2, Image as ImageIcon, Check, MessageSquare, Shield, Plus, Trash2
} from "lucide-react";

type PortalChecklistItem = {
    id: string;
    title: string;
    description: string | null;
    expected_type: string;
    status: "pending" | "uploaded";
    client_response: string | null;
    file_url: string | null;
};

type PortalProjectData = {
    name: string;
    company?: { name?: string | null } | null;
    agency?: {
        name?: string | null;
        logo_url?: string | null;
        primary_color?: string | null;
        secondary_color?: string | null;
    } | null;
    figma_url?: string | null;
    deployment_url?: string | null;
    portal_show_progress?: boolean | null;
    portal_message?: string | null;
};

const createEmptySection = (): PortalSectionBlock => ({
    id: crypto.randomUUID(),
    title: "",
    content: "",
    comment: "",
});

const buildInitialTextSections = (items: PortalChecklistItem[]): Record<string, PortalSectionBlock[]> => {
    return items.reduce<Record<string, PortalSectionBlock[]>>((acc, item) => {
        if (item.expected_type === "text" && item.status !== "uploaded") {
            const suggestedSections = getChecklistSuggestedSections(item.description);
            acc[item.id] = suggestedSections.length > 0
                ? suggestedSections.map((title) => ({ ...createEmptySection(), title }))
                : [createEmptySection()];
        }
        return acc;
    }, {});
};

export default function ClientPortalPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<{ project: PortalProjectData; checklists: PortalChecklistItem[] } | null>(null);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [textSections, setTextSections] = useState<Record<string, PortalSectionBlock[]>>({});
    const [generalComments, setGeneralComments] = useState<Record<string, string>>({});
    const [fileInputs, setFileInputs] = useState<Record<string, File | null>>({});

    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const loadData = async (magicToken: string) => {
        const result = await getPortalData(magicToken);
        if (result.success) {
            const checklists = (result.checklists ?? []) as PortalChecklistItem[];
            setData({
                project: result.project as PortalProjectData,
                checklists,
            });
            setTextSections(buildInitialTextSections(checklists));
        }
        else toast.error("Lien invalide ou expiré.");
        setIsLoading(false);
    };

    useEffect(() => {
        let cancelled = false;

        const fetchPortalData = async () => {
            const result = await getPortalData(token);
            if (cancelled) return;

            if (result.success) {
                const checklists = (result.checklists ?? []) as PortalChecklistItem[];
                setData({
                    project: result.project as PortalProjectData,
                    checklists,
                });
                setTextSections(buildInitialTextSections(checklists));
            } else {
                toast.error("Lien invalide ou expiré.");
            }
            setIsLoading(false);
        };

        void fetchPortalData();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const updateSection = (itemId: string, sectionId: string, field: "title" | "content" | "comment", value: string) => {
        setTextSections((current) => ({
            ...current,
            [itemId]: (current[itemId] ?? [createEmptySection()]).map((section) => (
                section.id === sectionId ? { ...section, [field]: value } : section
            )),
        }));
    };

    const addSection = (itemId: string) => {
        setTextSections((current) => ({
            ...current,
            [itemId]: [...(current[itemId] ?? [createEmptySection()]), createEmptySection()],
        }));
    };

    const removeSection = (itemId: string, sectionId: string) => {
        setTextSections((current) => {
            const remaining = (current[itemId] ?? []).filter((section) => section.id !== sectionId);
            return {
                ...current,
                [itemId]: remaining.length > 0 ? remaining : [createEmptySection()],
            };
        });
    };

    const handleSubmit = async (item: PortalChecklistItem) => {
        let textContent: string | undefined;
        const fileContent = fileInputs[item.id];

        if (item.expected_type === 'text') {
            const sections = (textSections[item.id] ?? []).filter((section) => (
                section.title.trim() || section.content.trim() || section.comment?.trim()
            ));

            if (sections.length === 0) return toast.error("Ajoutez au moins une section.");
            if (sections.some((section) => !section.title.trim() || !section.content.trim())) {
                return toast.error("Chaque section doit avoir un titre et un contenu.");
            }

            textContent = stringifyPortalResponse({
                version: 1,
                kind: "multi_section_text",
                sections,
                generalComment: generalComments[item.id]?.trim() || "",
            });
        }

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
            setTextSections((current) => ({ ...current, [item.id]: [createEmptySection()] }));
            setGeneralComments((current) => ({ ...current, [item.id]: "" }));
            setFileInputs((current) => ({ ...current, [item.id]: null }));
            loadData(token);
        } else {
            toast.error(result.error ?? "Erreur lors de l'envoi.");
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
    );
    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium text-lg">
            Projet introuvable.
        </div>
    );

    const { project, checklists } = data;
    const completedItems = checklists.filter(c => c.status === 'uploaded');
    const progressPercentage = checklists.length === 0 ? 100 : Math.round((completedItems.length / checklists.length) * 100);

    const agencyName = project.agency?.name || "L'Agence";
    const logoUrl: string | null = project.agency?.logo_url ?? null;
    const primaryColor: string = project.agency?.primary_color || '#0F172A';
    const secondaryColor: string = project.agency?.secondary_color || '#6366F1';
    const showProgress: boolean = project.portal_show_progress !== false;
    const portalMessage: string | null = project.portal_message ?? null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={agencyName}
                                width={32}
                                height={32}
                                unoptimized
                                className="h-8 w-8 rounded-lg object-contain"
                            />
                        ) : (
                            <div
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {agencyName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="font-bold text-slate-900 tracking-tight">{agencyName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                        <Shield className="w-3 h-3" />
                        Espace Client sécurisé
                    </div>
                </div>
            </header>

            {/* Accent line */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} />

            <main className="max-w-4xl mx-auto px-6 pt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Hero */}
                <section className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl text-slate-900 tracking-tight">
                        Bonjour,{" "}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                        >
                            {project.company?.name || "l'équipe"}
                        </span>{" "}
                        👋
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Bienvenue sur votre espace de suivi. C'est ici que nous centralisons les avancées de votre projet{" "}
                        <strong className="text-slate-700">{project.name}</strong>.
                    </p>
                </section>

                {/* Custom message from the agency */}
                {portalMessage && (
                    <section
                        className="p-6 rounded-2xl border"
                        style={{
                            backgroundColor: `${primaryColor}08`,
                            borderColor: `${primaryColor}25`,
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                            >
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>
                                    Message de {agencyName}
                                </p>
                                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{portalMessage}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Progress */}
                {showProgress && (
                    <section className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Progression des contenus</h2>
                                <p className="text-sm text-slate-500 mt-1">Éléments fournis à {agencyName}</p>
                            </div>
                            <div className="text-3xl font-black" style={{ color: primaryColor }}>
                                {progressPercentage}%
                            </div>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercentage}%`, background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                            />
                        </div>
                        {checklists.length > 0 && (
                            <p className="text-xs text-slate-400 mt-3 text-right">
                                {completedItems.length} / {checklists.length} éléments fournis
                            </p>
                        )}
                    </section>
                )}

                {/* Useful links */}
                {(project.figma_url || project.deployment_url) && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.figma_url && (
                            <a
                                href={project.figma_url}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center p-5 bg-white rounded-3xl border border-slate-200/60 hover:border-[#F24E1E]/40 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-[#F24E1E]/10 flex items-center justify-center text-[#F24E1E] mr-4 shrink-0 group-hover:scale-110 transition-transform">
                                    <PenTool className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-900">Maquettes Design</div>
                                    <div className="text-sm text-slate-500">Ouvrir Figma</div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#F24E1E] group-hover:translate-x-1 transition-all" />
                            </a>
                        )}
                        {project.deployment_url && (
                            <a
                                href={project.deployment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center p-5 bg-white rounded-3xl border border-slate-200/60 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                            >
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

                {/* Checklist */}
                <section className="space-y-6 pt-2 border-t border-slate-200/60">
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
                                const Icon = item.expected_type === 'image' ? ImageIcon : FileType2;
                                const sections = textSections[item.id] ?? [createEmptySection()];
                                const structuredResponse = parsePortalClientResponse(item.client_response);
                                const responsePreview = buildPortalResponsePreview(item.client_response);
                                const canSubmitText = sections.some((section) => section.title.trim() && section.content.trim());
                                const displayDescription = getChecklistDisplayDescription(item.description);
                                const suggestedSections = getChecklistSuggestedSections(item.description);

                                return (
                                    <div
                                        key={item.id}
                                        className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-300 ${isDone
                                            ? 'bg-slate-50 border-slate-200'
                                            : 'bg-white border-slate-300 shadow-xl shadow-slate-200/40 hover:border-slate-400'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-emerald-100 text-emerald-600' : ''}`}
                                                    style={!isDone ? { backgroundColor: `${primaryColor}15`, color: primaryColor } : {}}
                                                >
                                                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className={`text-lg font-bold ${isDone ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>
                                                        {item.title}
                                                    </h3>
                                                    {displayDescription && (
                                                        <p className="text-sm text-slate-500 mt-1">{displayDescription}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {!isDone ? (
                                            <div className="space-y-4">
                                                {item.expected_type === 'text' && (
                                                    <div className="space-y-4">
                                                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                                                            <p className="text-sm font-semibold text-slate-900">Ajoutez vos sections de contenu</p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Exemple : Hero, À propos, Témoignages, FAQ. Vous pouvez ajouter une note par section.
                                                            </p>
                                                            {suggestedSections.length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {suggestedSections.map((section) => (
                                                                        <span
                                                                            key={section}
                                                                            className="inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 border border-slate-200"
                                                                        >
                                                                            {section}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {sections.map((section, index) => (
                                                            <div key={section.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                                                                <div className="flex items-center justify-between gap-3">
                                                                    <p className="text-sm font-semibold text-slate-900">Section {index + 1}</p>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => removeSection(item.id, section.id)}
                                                                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                                                                        disabled={sections.length === 1}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>

                                                                <Input
                                                                    placeholder="Titre de la section"
                                                                    value={section.title}
                                                                    onChange={(e) => updateSection(item.id, section.id, "title", e.target.value)}
                                                                    className="h-11 rounded-xl border-slate-200 bg-white"
                                                                />

                                                                <Textarea
                                                                    placeholder="Votre contenu pour cette section..."
                                                                    value={section.content}
                                                                    onChange={(e) => updateSection(item.id, section.id, "content", e.target.value)}
                                                                    className="min-h-[120px] bg-white rounded-2xl resize-none border-slate-200 text-base p-4"
                                                                />

                                                                <Textarea
                                                                    placeholder="Commentaire ou précision optionnelle"
                                                                    value={section.comment || ""}
                                                                    onChange={(e) => updateSection(item.id, section.id, "comment", e.target.value)}
                                                                    className="min-h-[72px] bg-white rounded-2xl resize-none border-slate-200 text-sm p-4"
                                                                />
                                                            </div>
                                                        ))}

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => addSection(item.id)}
                                                            className="h-11 rounded-xl border-dashed"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Ajouter une section
                                                        </Button>

                                                        <Textarea
                                                            placeholder="Commentaire général pour l'agence (optionnel)"
                                                            value={generalComments[item.id] || ""}
                                                            onChange={(e) => setGeneralComments({ ...generalComments, [item.id]: e.target.value })}
                                                            className="min-h-[88px] bg-slate-50/50 rounded-2xl resize-none border-slate-200 text-sm p-4"
                                                        />
                                                    </div>
                                                )}

                                                {(item.expected_type === 'image' || item.expected_type === 'file') && (
                                                    <div
                                                        onClick={() => fileInputRefs.current[item.id]?.click()}
                                                        className="relative border-2 border-dashed border-slate-300 hover:bg-slate-50 transition-colors rounded-2xl p-8 text-center cursor-pointer group"
                                                        style={{ '--hover-border': primaryColor } as React.CSSProperties}
                                                        onMouseEnter={e => (e.currentTarget.style.borderColor = primaryColor)}
                                                        onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
                                                    >
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            ref={el => { fileInputRefs.current[item.id] = el; }}
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
                                                        disabled={submittingId === item.id || (item.expected_type === 'text' ? !canSubmitText : !fileInputs[item.id])}
                                                        className="text-white rounded-xl px-6 h-12 shadow-md transition-all active:scale-95"
                                                        style={{ backgroundColor: primaryColor }}
                                                    >
                                                        {submittingId === item.id
                                                            ? <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                            : "Envoyer à l'agence"
                                                        }
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                                                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                                    {item.file_url
                                                        ? <UploadCloud className="w-5 h-5 text-slate-400" />
                                                        : <FileType2 className="w-5 h-5 text-slate-400" />
                                                    }
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Fourni par vous</div>
                                                    {item.file_url ? (
                                                        <PortalUploadAccessButton itemId={item.id} portalToken={token} variant="link">
                                                            {item.client_response} (Voir le fichier)
                                                        </PortalUploadAccessButton>
                                                    ) : structuredResponse ? (
                                                        <div className="space-y-3">
                                                            <p className="text-sm font-medium text-slate-700">{responsePreview}</p>
                                                            <div className="space-y-2">
                                                                {structuredResponse.sections.map((section) => (
                                                                    <div key={section.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                                        <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                                                                        <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{section.content}</p>
                                                                        {section.comment?.trim() && (
                                                                            <p className="mt-2 text-xs text-slate-500 whitespace-pre-wrap">
                                                                                Note : {section.comment}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {structuredResponse.generalComment?.trim() && (
                                                                <p className="text-xs text-slate-500 whitespace-pre-wrap">
                                                                    Commentaire général : {structuredResponse.generalComment}
                                                                </p>
                                                            )}
                                                        </div>
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

                {/* Footer */}
                <footer className="pt-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        {logoUrl ? (
                            <Image src={logoUrl} alt={agencyName} width={16} height={16} unoptimized className="h-4 w-4 rounded object-contain opacity-50" />
                        ) : (
                            <div
                                className="h-4 w-4 rounded flex items-center justify-center text-white text-[8px] font-bold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {agencyName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        Espace client propulsé par {agencyName}
                    </div>
                </footer>
            </main>
        </div>
    );
}
