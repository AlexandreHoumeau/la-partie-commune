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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
                <div className="lg:col-span-3 flex flex-col gap-6 p-6 overflow-y-auto">
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4">Assistant IA</h2>
                        <AIMessageGenerator opportunity={opportunity} />
                    </div>
                </div>
                <div className="flex flex-col h-full overflow-y-auto border-l border-gray-200 bg-white p-6">
                    <OpportunitySidebarInfo {...opportunity} />
                </div>
            </div>
        </div>
    )
}
