"use client";

import { TrackingLinksManager } from "../_components/TrackingLinksManager";
import { useOpportunity } from "../_components/opportunity-context";

export default function TrackingPage() {
  const opportunity = useOpportunity();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <TrackingLinksManager
        opportunityId={opportunity.id}
        agencyId={opportunity.agency_id!}
      />
    </div>
  );
}
