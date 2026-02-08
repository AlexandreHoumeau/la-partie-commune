import OpportunityHeader from "./_components/opportunity-header"
import OpportunityMetadata from "./_components/opportunity-metadata"
import OpportunityTimeline from "./_components/opportunity-timeline"
import OpportunityEmails from "./_components/opportunity-emails"
import OpportunityActions from "./_components/opportunity-actions"
import { getOpportunityBySlug } from "@/actions/opportunity.server"

export default async function OpportunityPage({
    params,
}: {
    params: { slug: string }
}) {
    const { slug } = await params
    const opportunity = await getOpportunityBySlug(slug)
    if (!opportunity) {
        return <div>Opportunity not found</div>
    }

    return (
        <div className="flex flex-col gap-6">
            <OpportunityHeader opportunity={opportunity} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne gauche */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <OpportunityTimeline opportunityId={opportunity.id} />
                    <OpportunityEmails opportunityId={opportunity.id} />
                </div>

                {/* Colonne droite */}
                <div className="flex flex-col gap-6">
                    <OpportunityMetadata opportunity={opportunity} />
                    <OpportunityActions opportunity={opportunity} />
                </div>
            </div>
        </div>
    )
}
