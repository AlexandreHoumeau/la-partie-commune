"use client";

import { useState, useTransition } from "react";
import { addOpportunityNote, getOpportunityTimeline } from "@/actions/timeline.server";
import { OpportunityEvent, mapOpportunityStatusLabel } from "@/lib/validators/oppotunities";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Sparkles,
    ArrowRight,
    Pencil,
    MessageSquare,
    Wand2,
    Link,
    Loader2,
    Clock,
    Send,
} from "lucide-react";

// --- Date formatters ---
function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    
    if (isToday) return "Aujourd'hui";
    
    return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
    });
}

// --- Event config ---
type EventConfig = {
    icon: React.ReactNode;
    color: string;
    label: (metadata: Record<string, any>) => React.ReactNode;
};

const STATUS_BADGE_COLOR: Record<string, string> = {
    to_do: "bg-slate-100 text-slate-600 border-slate-200",
    first_contact: "bg-sky-100 text-sky-700 border-sky-200",
    second_contact: "bg-blue-100 text-blue-700 border-blue-200",
    proposal_sent: "bg-violet-100 text-violet-700 border-violet-200",
    negotiation: "bg-amber-100 text-amber-700 border-amber-200",
    won: "bg-emerald-100 text-emerald-700 border-emerald-200",
    lost: "bg-red-100 text-red-600 border-red-200",
};

function StatusBadge({ status }: { status: string }) {
    const label = mapOpportunityStatusLabel[status as keyof typeof mapOpportunityStatusLabel] ?? status;
    const color = STATUS_BADGE_COLOR[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
            {label}
        </span>
    );
}

const EVENT_CONFIG: Record<string, EventConfig> = {
    created: {
        icon: <Sparkles className="w-4 h-4" />,
        color: "bg-violet-100 text-violet-600 border-violet-200",
        label: () => "a créé l'opportunité",
    },
    status_changed: {
        icon: <ArrowRight className="w-4 h-4" />,
        color: "bg-blue-100 text-blue-600 border-blue-200",
        label: () => "a changé le statut",
    },
    info_updated: {
        icon: <Pencil className="w-4 h-4" />,
        color: "bg-amber-100 text-amber-600 border-amber-200",
        label: () => "a mis à jour les informations",
    },
    note_added: {
        icon: <MessageSquare className="w-4 h-4" />,
        color: "bg-slate-100 text-slate-600 border-slate-200",
        label: () => "a laissé une note",
    },
    ai_message_generated: {
        icon: <Wand2 className="w-4 h-4" />,
        color: "bg-emerald-100 text-emerald-600 border-emerald-200",
        label: (m) => `a généré un message IA${m.channel ? ` via ${m.channel}` : ""}`,
    },
    tracking_link_created: {
        icon: <Link className="w-4 h-4" />,
        color: "bg-cyan-100 text-cyan-600 border-cyan-200",
        label: (m) => `a créé un lien de tracking${m.campaign_name ? ` (${m.campaign_name})` : ""}`,
    },
};

// --- Avatar Component ---
function Avatar({ user, className = "w-6 h-6 text-[10px]" }: { user: OpportunityEvent["user"], className?: string }) {
    if (!user) {
        return (
            <div className={`rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 shadow-sm ${className}`}>
                <Wand2 className="w-1/2 h-1/2 text-slate-400" />
            </div>
        );
    }
    const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "?";
    
    return (
        <div 
            className={`rounded-full bg-slate-900 text-white flex items-center justify-center font-medium tracking-wide shadow-sm ${className}`}
            title={`${user.first_name} ${user.last_name}`}
        >
            {initials}
        </div>
    );
}

// --- Author Name Component ---
function AuthorName({ user }: { user: OpportunityEvent["user"] }) {
    if (!user) return <span className="font-semibold text-slate-900">Le système</span>;
    return (
        <span className="font-semibold text-slate-900">
            {user.first_name} {user.last_name}
        </span>
    );
}

// --- Single Event Row (Center-Axis Layout) ---
function EventRow({ event }: { event: OpportunityEvent }) {
    const config = EVENT_CONFIG[event.event_type];
    if (!config) return null;
    
    const isNote = event.event_type === "note_added";
    const isStatusChange = event.event_type === "status_changed";

    return (
        <div className="group relative flex w-full">
            {/* Left Column: Date & Time */}
            <div className="w-24 shrink-0 text-right pr-6 pt-1.5 pb-8 group-last:pb-0">
                <div className="text-sm font-semibold text-slate-900">{formatTime(event.created_at)}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{formatDate(event.created_at)}</div>
            </div>

            {/* Middle Column: Axis & Icon */}
            <div className="relative flex flex-col items-center">
                {/* The vertical line */}
                <div className="absolute top-8 bottom-[-1rem] w-px bg-slate-200/60 group-last:hidden" />

                {/* The Icon */}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm ${config.color}`}>
                    {config.icon}
                </div>
            </div>

            {/* Right Column: Content */}
            <div className="flex-1 pl-6 pb-8 group-last:pb-0 pt-1.5 min-w-0">
                {isNote ? (
                    <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100/80 bg-slate-50/50">
                            <Avatar user={event.user} className="w-6 h-6 text-[10px]" />
                            <div className="text-sm text-slate-600">
                                <AuthorName user={event.user} /> a laissé une note
                            </div>
                        </div>
                        <div className="p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {event.metadata.text}
                        </div>
                    </div>
                ) : isStatusChange ? (
                    <div className="flex items-center gap-2 bg-slate-50/50 border border-transparent rounded-xl px-4 py-2 hover:bg-white hover:border-slate-200/60 hover:shadow-sm transition-all w-fit max-w-full">
                        <Avatar user={event.user} className="w-5 h-5 text-[9px]" />
                        <div className="text-sm text-slate-600 flex items-center gap-2 flex-wrap">
                            <AuthorName user={event.user} />
                            {event.metadata.from && <StatusBadge status={event.metadata.from} />}
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {event.metadata.to && <StatusBadge status={event.metadata.to} />}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-slate-50/50 border border-transparent rounded-xl px-4 py-2 hover:bg-white hover:border-slate-200/60 hover:shadow-sm transition-all w-fit max-w-full">
                        <Avatar user={event.user} className="w-5 h-5 text-[9px]" />
                        <div className="text-sm text-slate-600 truncate">
                            <AuthorName user={event.user} /> <span className="text-slate-500">{config.label(event.metadata)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Main component ---
export default function OpportunityTimeline({
    opportunityId,
    initialEvents,
}: {
    opportunityId: string;
    initialEvents: OpportunityEvent[];
}) {
    const [events, setEvents] = useState<OpportunityEvent[]>(initialEvents);
    const [note, setNote] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleAddNote = () => {
        if (!note.trim()) return;
        startTransition(async () => {
            const result = await addOpportunityNote(opportunityId, note);
            if (result.success) {
                setNote("");
                const { data: fresh } = await getOpportunityTimeline(opportunityId);
                setEvents(fresh);
                toast.success("Note ajoutée avec succès");
            } else {
                toast.error(result.error ?? "Erreur lors de l'ajout de la note.");
            }
        });
    };

    return (
        <div className="w-full max-w-3xl mx-auto py-6">
            
            {/* Centered Composer */}
            <div className="mb-12 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 rounded-[24px] blur-sm opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white border border-slate-200/80 rounded-[20px] shadow-sm overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-300 transition-all">
                    <Textarea
                        placeholder="Rédiger une note ou un point de suivi..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-[100px] resize-none border-0 shadow-none focus-visible:ring-0 rounded-none bg-transparent px-5 py-4 text-sm placeholder:text-slate-400"
                        disabled={isPending}
                    />
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-100">
                        <span className="text-xs font-medium text-slate-400 px-1">
                            Appuyez sur Entrée pour des retours à la ligne
                        </span>
                        <Button
                            onClick={handleAddNote}
                            disabled={isPending || !note.trim()}
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-full h-9 px-5 text-sm font-medium transition-all shadow-sm"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            Publier la note
                        </Button>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                            <Clock className="w-5 h-5 text-slate-300" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 mb-1">Historique vierge</h3>
                        <p className="text-sm text-slate-500 text-center max-w-[280px]">
                            Toutes les actions et notes liées à cette opportunité s'afficheront ici.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {events.map((event) => (
                            <EventRow key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
            
        </div>
    );
}