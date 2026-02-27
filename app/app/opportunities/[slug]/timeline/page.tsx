import { getOpportunityBySlug } from "@/actions/opportunity.server";
import { getOpportunityTimeline } from "@/actions/timeline.server";
import OpportunityTimeline from "../_components/opportunity-timeline";

export default async function TimelinePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const opportunity = await getOpportunityBySlug(slug);

    if (!opportunity) {
        return <div className="p-10 text-center text-slate-500">Opportunité introuvable.</div>;
    }

    const { data: events } = await getOpportunityTimeline(opportunity.id);

    return (
        <OpportunityTimeline
            opportunityId={opportunity.id}
            initialEvents={events}
        />
    );
}
