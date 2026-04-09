"use client";

import { TrackingLinksManager } from "../_components/TrackingLinksManager";
import { useOpportunity } from "../_components/opportunity-context";

export default function TrackingPage() {
  const opportunity = useOpportunity();

  return (
    <div className="w-full">
      <TrackingLinksManager
        opportunityId={opportunity.id}
        agencyId={opportunity.agency_id!}
        opportunityStatus={opportunity.status}
        companyName={opportunity.company?.name}
        companyWebsite={opportunity.company?.website}
        companyLinks={opportunity.company?.links ?? []}
      />
    </div>
  );
}
