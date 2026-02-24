"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";

import { AIMessageGenerator } from "./_components/AIMessageGenerator";
import { TrackingLinksManager } from "./_components/TrackingLinksManager";
import { OpportunityAnalytics } from "./_components/OpportunityAnalytics";
import { OpportunityAIContext } from "@/lib/email_generator/utils";
import type { OpportunityTabId } from "./_components/opportunity-header";

export function OpportunityPageContent({
  opportunity,
  activeTab,
}: {
  opportunity: OpportunityAIContext;
  activeTab: OpportunityTabId;
}) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
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
