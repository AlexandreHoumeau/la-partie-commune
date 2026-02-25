import { fetchSettingsData } from "@/actions/settings.server";
import { AnalyticsDashboard } from "./_components/AnalyticsDashboard";

export default async function AgencyAnalyticsPage() {
  const { agency } = await fetchSettingsData();

  return (
    <AnalyticsDashboard
      agencyId={agency?.id ?? ""}
      agencyName={agency?.name ?? "Mon Agence"}
    />
  );
}
