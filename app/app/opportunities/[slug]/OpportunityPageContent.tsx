"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, BarChart3, Link2, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Tes composants existants
import { AIMessageGenerator } from "./_components/AIMessageGenerator";
import { TrackingLinksManager } from "./_components/TrackingLinksManager";
import { OpportunityAnalytics } from "./_components/OpportunityAnalytics";
import { OpportunityAIContext } from "@/lib/email_generator/utils";

const TABS = [
    { id: "message", label: "Message IA", icon: Mail, color: "text-blue-600", bg: "bg-blue-500" },
    { id: "tracking", label: "Liens & Tracking", icon: Link2, color: "text-indigo-600" },
    { id: "analytics", label: "Analytics", icon: BarChart3, color: "text-emerald-600" },
    { id: "timeline", label: "Timeline", icon: Calendar, color: "text-slate-600" },
] as const;

type TabId = typeof TABS[number]["id"];

export function OpportunityPageContent({ opportunity, agencyWebsite }: { opportunity: OpportunityAIContext; agencyWebsite?: string | null }) {
    const [activeTab, setActiveTab] = useState<TabId>("message");

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Navigation Style SaaS "Pill" */}
            <div className="flex items-center justify-between">
                <nav className="flex p-1 gap-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200/50 overflow-x-auto no-scrollbar">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap outline-none",
                                    isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {/* La Pilule Blanche Animée */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabOpp"
                                        className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}

                                <Icon className={cn(
                                    "h-4 w-4 shrink-0 z-10 transition-colors",
                                    isActive ? tab.color : "text-slate-400 group-hover:text-slate-600"
                                )} />

                                <span className="relative z-10">{tab.label}</span>

                                {/* Badge IA spécial pour le premier onglet */}
                                {tab.id === 'message' && (
                                    <Sparkles className={cn(
                                        "h-3 w-3 z-10 transition-opacity",
                                        isActive ? "opacity-100 text-blue-500" : "opacity-0"
                                    )} />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Contenu avec transition fluide */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {activeTab === "message" && (
                            <AIMessageGenerator opportunity={opportunity} />
                        )}

                        {activeTab === "tracking" && (
                            <TrackingLinksManager
                                opportunityId={opportunity.id}
                                agencyId={opportunity.agency_id!}
                            />
                        )}

                        {activeTab === "analytics" && (
                            <OpportunityAnalytics opportunityId={opportunity.id} />
                        )}

                        {activeTab === "timeline" && (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                                <Calendar className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm font-medium">Bientôt disponible</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}