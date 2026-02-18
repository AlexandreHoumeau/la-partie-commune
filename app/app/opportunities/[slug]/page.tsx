import { getOpportunityBySlug } from "@/actions/opportunity.server"
import { Separator } from "@/components/ui/separator"
import OpportunityHeader from "./_components/opportunity-header"
import OpportunitySidebarInfo from "./_components/opportunity-sidebar"
import { OpportunityPageContent } from "./OpportunityPageContent"
import { useAgency } from "@/providers/agency-provider"

export default async function OpportunityPage({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const opportunity = await getOpportunityBySlug(slug)

    if (!opportunity) return <div className="p-10 text-center">Opportunity not found</div>

    return (
        <div className="flex flex-col h-screen bg-[#fafafa]"> {/* Fond légèrement gris pour faire ressortir les cartes blanches */}
            <OpportunityHeader opportunity={opportunity} />

            <main className="grid grid-cols-1 lg:grid-cols-5 flex-1 overflow-hidden">
                {/* Zone de contenu principale */}
                <div className="lg:col-span-4 flex flex-col overflow-y-auto px-4 lg:px-8 py-6">
                    <OpportunityPageContent opportunity={opportunity} />
                </div>

                {/* Sidebar avec style SaaS */}
                <aside className="hidden lg:flex flex-col h-full overflow-y-auto border-l bg-white/50 backdrop-blur-md p-6 shadow-sm">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                        Informations Clés
                    </h3>
                    <OpportunitySidebarInfo {...opportunity} />
                </aside>
            </main>
        </div>
    )
}