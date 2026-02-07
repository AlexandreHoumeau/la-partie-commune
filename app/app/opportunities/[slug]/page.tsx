import { getOpportunityBySlug } from "@/actions/opportunity.actions";
import { notFound } from "next/navigation";

interface OpportunityPageProps {
    params: {
        slug: string;
    };
}

interface Opportunity {
    id: string;
    slug: string;
    title: string;
    description: string;
    // Add other fields as needed
}

export default async function OpportunityPage({
    params,
}: OpportunityPageProps) {
    const opportunity = await getOpportunityBySlug(params.slug);

    if (!opportunity) {
        notFound();
    }

    return (
        <main className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">{opportunity.name}</h1>
            <p className="text-gray-600">{opportunity.description}</p>
        </main>
    );
}