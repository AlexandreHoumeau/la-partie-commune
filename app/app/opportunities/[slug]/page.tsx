"use client";

import { AIMessageGenerator } from "./_components/AIMessageGenerator";
import { useOpportunity } from "./_components/opportunity-context";

export default function OpportunityPage() {
    const opportunity = useOpportunity();

    return (
        <div className="w-full max-w-6xl mx-auto">
            <AIMessageGenerator opportunity={opportunity} />
        </div>
    );
}
