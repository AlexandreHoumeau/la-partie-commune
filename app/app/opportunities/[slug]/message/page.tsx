import { getOpportunityBySlug } from "@/actions/opportunity.server";
import { getAuthenticatedUserContext } from "@/actions/profile.server";
import { getOpportunityTimeline } from "@/actions/timeline.server";
import { getTrackingLinks } from "@/actions/tracking.server";
import { ProPageGate } from "@/components/pro-page-gate";
import { isProPlan } from "@/lib/validators/agency";
import { OpportunityEvent } from "@/lib/validators/oppotunities";
import { AIMessageChat } from "../_components/AIMessageChat";

export default async function MessagePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const userContext = await getAuthenticatedUserContext();
    if (!userContext || !isProPlan(userContext.agency)) {
        return <ProPageGate feature="ai" />;
    }

    const opportunity = await getOpportunityBySlug(slug);
    if (!opportunity) return null;

    const [timelineResult, trackingResult] = await Promise.all([
        getOpportunityTimeline(opportunity.id),
        getTrackingLinks(opportunity.id),
    ]);

    const notes = (timelineResult.data ?? []).filter(
        (e): e is OpportunityEvent => e.event_type === "note_added"
    );
    const trackingLinks = (trackingResult.data ?? []) as {
        id: string;
        short_code: string;
        is_active: boolean;
        campaign_name: string | null;
    }[];

    return (
        <div className="w-full max-w-5xl mx-auto h-full">
            <AIMessageChat
                opportunity={opportunity}
                notes={notes}
                trackingLinks={trackingLinks}
            />
        </div>
    );
}
