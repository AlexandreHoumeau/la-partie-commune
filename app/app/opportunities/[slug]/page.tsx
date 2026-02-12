import { getOpportunityBySlug } from "@/actions/opportunity.server"
import { Separator } from "@/components/ui/separator"
import { AIMessageGenerator } from "./_components/AIMessageGenerator"
import OpportunityHeader from "./_components/opportunity-header"
import OpportunitySidebarInfo from "./_components/opportunity-sidebar"

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
        <div className="flex flex-col h-screen">
            <OpportunityHeader opportunity={opportunity} />
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-1 lg:grid-cols-5 flex-1 overflow-hidden">
                <div className="lg:col-span-4 flex flex-col p-2 overflow-y-auto">
                    <AIMessageGenerator opportunity={opportunity} />
                </div>
                <div className="flex flex-col h-full overflow-y-auto border-l border-gray-200 bg-white p-4">
                    <OpportunitySidebarInfo {...opportunity} />
                </div>
            </div>
        </div>
    )
}
