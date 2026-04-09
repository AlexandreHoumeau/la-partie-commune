import { mapOpportunityStatusLabel, OpportunityStatus } from "@/lib/validators/oppotunities";

export function buildTrackingCampaignName(status: OpportunityStatus, companyName?: string | null): string {
  const statusLabel =
    status === "to_do"
      ? "Premier contact"
      : mapOpportunityStatusLabel[status] ?? "Suivi";
  const normalizedCompanyName = companyName?.trim();

  if (!normalizedCompanyName) {
    return statusLabel;
  }

  return `${statusLabel} ${normalizedCompanyName}`;
}
