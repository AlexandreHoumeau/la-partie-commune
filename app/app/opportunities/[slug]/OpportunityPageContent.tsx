"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, BarChart3, Link2, MessageSquare, Calendar } from "lucide-react";
import { AIMessageGenerator } from "./_components/AIMessageGenerator";
import { TrackingLinksManager } from "./_components/TrackingLinksManager";
import { OpportunityAnalytics } from "./_components/OpportunityAnalytics";
// import { OpportunityTimeline } from "./_components/OpportunityTimeline";
import { OpportunityAIContext } from "@/lib/email_generator/utils";

interface OpportunityPageContentProps {
    opportunity: OpportunityAIContext;
    agencyWebsite?: string | null;
}

export function OpportunityPageContent({ opportunity, agencyWebsite }: OpportunityPageContentProps) {
    return (
        <div className="container mx-auto ">
            <Tabs defaultValue="message" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid mb-8">
                    <TabsTrigger value="message" className="gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline">Message IA</span>
                        <span className="sm:hidden">Message</span>
                    </TabsTrigger>
                    <TabsTrigger value="tracking" className="gap-2">
                        <Link2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Liens & Tracking</span>
                        <span className="sm:hidden">Liens</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Analytics</span>
                        <span className="sm:hidden">Stats</span>
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Timeline</span>
                        <span className="sm:hidden">Timeline</span>
                    </TabsTrigger>
                </TabsList>

                {/* Message Generator Tab */}
                <TabsContent value="message" className="mt-0">
                    <AIMessageGenerator
                        opportunity={opportunity}
                    // agencyWebsite={agencyWebsite}
                    />
                </TabsContent>

                {/* Tracking Links Tab */}
                <TabsContent value="tracking" className="mt-0">
                    <TrackingLinksManager
                        opportunityId={opportunity.id}
                        agencyId={opportunity.agency_id!}
                        agencyWebsite={agencyWebsite}
                    />
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="mt-0">
                    <OpportunityAnalytics
                        opportunityId={opportunity.id}
                    />
                </TabsContent>

                {/* Timeline Tab */}
                <TabsContent value="timeline" className="mt-0">
                    {/* <OpportunityTimeline
                        opportunityId={opportunity.id}
                    /> */}
                </TabsContent>
            </Tabs>
        </div>
    );
}