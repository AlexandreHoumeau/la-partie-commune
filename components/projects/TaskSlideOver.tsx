
"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, AlignLeft, Bug, LayoutTemplate, PenTool, Settings, ArrowUp, ArrowDown, Equal, AlertOctagon, CheckCircle2, Clock, Inbox, PlayCircle } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";
import { createTask, updateTaskDetails } from "@/actions/project.server";
import { deleteTask } from "@/actions/task.server";

interface TaskSlideOverProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: any | null;
    projectId: string;
    onSaved: () => void;
    initialStatus?: string;
}

export function TaskSlideOver({ open, onOpenChange, task, projectId, onSaved, initialStatus }: TaskSlideOverProps) {
    const { profile } = useUserProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(initialStatus || "todo");
    const [priority, setPriority] = useState("medium");
    const [type, setType] = useState("feature");

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setStatus(task.status || "todo");
            setPriority(task.priority || "medium");
            setType(task.type || "feature");
        } else {
            setTitle(""); setDescription(""); setStatus("todo"); setPriority("medium"); setType("feature");
        }
    }, [task, open]);

    const handleSave = async () => {
        if (!title.trim()) return toast.error("Le titre est obligatoire.");
        if (!profile?.agency_id) return;

        setIsLoading(true);
        const data = { title, description, status, priority, type };

        let result;
        if (task) {
            result = await updateTaskDetails(task.id, data);
        } else {
            result = await createTask(data, profile.agency_id, projectId);
        }

        setIsLoading(false);

        if (result.success) {
            toast.success(task ? "Ticket mis à jour" : "Ticket créé");
            onSaved();
            onOpenChange(false);
        } else {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async () => {
        setIsLoading(true)
        const result = await deleteTask(task.id)
        setIsLoading(false);

        if (result.success) {
            toast.success("Ticket supprimé");
            onSaved();
            onOpenChange(false);
        } else {
            toast.error("Erreur lors de la supression");
        }
    }


    const TypeIcon = { feature: AlignLeft, bug: Bug, design: LayoutTemplate, content: PenTool, setup: Settings }[type] as any;
    const PriorityIcon = { low: ArrowDown, medium: Equal, high: ArrowUp, urgent: AlertOctagon }[priority] as any;
    const StatusIcon = { todo: Inbox, in_progress: PlayCircle, review: Clock, done: CheckCircle2 }[status] as any;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* max-w-4xl permet d'avoir un très grand tiroir pour diviser l'écran en deux */}
            <SheetContent className="sm:max-w-4xl p-0 flex flex-col bg-white border-l border-slate-200 shadow-2xl [&>button:first-of-type]:hidden">

                {/* Header du Slide-over */}
                <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>{task ? `TCK-${task.id.split('-')[0].substring(0, 4)}` : "Nouveau Ticket"}</span>
                    </div>
                    <div className="flex gap-4">

                        <Button variant="default" onClick={handleSave} disabled={isLoading} className="px-6 text-xs font-bold shadow-sm transition-all active:scale-95">
                            {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
                            {task ? "Enregistrer" : "Créer le ticket"}
                        </Button>
                        {task && (
                            <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="px-6 text-xs font-bold shadow-sm transition-all active:scale-95">
                                Suprrimer
                            </Button>
                        )}
                    </div>
                </div>

                {/* Contenu divisé en 2 colonnes */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Colonne Gauche : Écriture (70%) */}
                    <div className="flex-1 p-8 overflow-y-auto space-y-8">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Titre du ticket..."
                            className="w-full text-3xl font-bold text-slate-900 border-none focus:outline-none placeholder:text-slate-300 resize-none"
                            autoFocus={!task}
                        />

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900">Description</h3>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ajoutez du contexte, des liens, des critères d'acceptation..."
                                className="min-h-[300px] text-base leading-relaxed border-none bg-slate-50/50 hover:bg-slate-50 focus-visible:bg-slate-50 rounded-2xl p-6 shadow-none focus-visible:ring-0 resize-none transition-colors"
                            />
                        </div>

                        {/* Zone de commentaires (Placeholder design) */}
                        {task && (
                            <div className="pt-8 border-t border-slate-100 space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900">Activité</h3>
                                <div className="flex gap-3 items-center">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0" />
                                    <input
                                        placeholder="Écrire un commentaire..."
                                        className="flex-1 h-10 bg-slate-50 rounded-full px-4 text-sm border border-slate-200 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Colonne Droite : Attributs (30%) */}
                    <div className="w-80 border-l border-slate-100 bg-slate-50/30 p-6 space-y-6 overflow-y-auto">

                        <div className="space-y-1 pb-4 border-b border-slate-200/60">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Propriétés</h4>

                            {/* Attribut : Statut */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold text-slate-500">Statut</span>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white shadow-sm text-xs font-medium focus:ring-blue-500">
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className="w-3.5 h-3.5 text-slate-400" />
                                            <SelectValue />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="todo">À faire</SelectItem>
                                        <SelectItem value="in_progress">En cours</SelectItem>
                                        <SelectItem value="review">En revue</SelectItem>
                                        <SelectItem value="done">Terminé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Attribut : Type */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-slate-500">Catégorie</span>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-9 rounded-lg border-transparent hover:bg-slate-100 bg-transparent shadow-none text-xs font-medium focus:ring-0 px-2 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <TypeIcon className="w-3.5 h-3.5 text-slate-400" />
                                        <SelectValue className="capitalize" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="feature">Fonctionnalité</SelectItem>
                                    <SelectItem value="bug">Bug</SelectItem>
                                    <SelectItem value="design">Design</SelectItem>
                                    <SelectItem value="content">Contenu</SelectItem>
                                    <SelectItem value="setup">Setup / Infra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Attribut : Priorité */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-slate-500">Priorité</span>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className="h-9 rounded-lg border-transparent hover:bg-slate-100 bg-transparent shadow-none text-xs font-medium focus:ring-0 px-2 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <PriorityIcon className={cn("w-3.5 h-3.5", priority === 'urgent' ? "text-red-500" : "text-slate-400")} />
                                        <SelectValue className="capitalize" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="low">Basse</SelectItem>
                                    <SelectItem value="medium">Moyenne</SelectItem>
                                    <SelectItem value="high">Haute</SelectItem>
                                    <SelectItem value="urgent">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}