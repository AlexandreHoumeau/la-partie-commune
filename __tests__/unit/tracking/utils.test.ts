import { describe, expect, it } from "vitest";

import { buildTrackingCampaignName } from "@/lib/tracking/utils";

describe("buildTrackingCampaignName", () => {
  it("builds a tracking label from status and company name", () => {
    expect(buildTrackingCampaignName("to_do", "Hurricane Music")).toBe("Premier contact Hurricane Music");
    expect(buildTrackingCampaignName("first_contact", "Hurricane Music")).toBe("Premier contact Hurricane Music");
  });

  it("falls back to the status label when company name is missing", () => {
    expect(buildTrackingCampaignName("proposal_sent", "")).toBe("Proposition envoyée");
  });
});
