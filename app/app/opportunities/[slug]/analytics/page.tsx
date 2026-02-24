"use client";

import { OpportunityAnalytics } from "../_components/OpportunityAnalytics";
import { useOpportunity } from "../_components/opportunity-context";

export default function AnalyticsPage() {
  const opportunity = useOpportunity();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <OpportunityAnalytics opportunityId={opportunity.id} />
    </div>
  );
}
