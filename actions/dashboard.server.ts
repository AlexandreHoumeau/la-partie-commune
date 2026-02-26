"use server";

import { createClient } from "@/lib/supabase/server";
import { OpportunityStatus } from "@/lib/validators/oppotunities";

export type FavoriteOpp = {
  id: string;
  name: string;
  slug: string;
  status: string;
  company: { name: string } | null;
};

export type RecentProject = {
  id: string;
  name: string;
  slug: string;
  status: string;
  company: { name: string } | null;
};

export type PipelineRow = {
  status: OpportunityStatus;
  count: number;
};

export type DashboardData = {
  activeOpps: number;
  wonCount: number;
  lostCount: number;
  closedCount: number;
  conversionRate: number | null;
  activeProjectsCount: number;
  totalProjectsCount: number;
  pipelineRows: PipelineRow[];
  pipelineTotal: number;
  favoriteOpps: FavoriteOpp[];
};

const PIPELINE_STATUSES: OpportunityStatus[] = [
  "to_do",
  "first_contact",
  "second_contact",
  "proposal_sent",
  "negotiation",
];

export async function getDashboardData(agencyId: string): Promise<DashboardData> {
  const supabase = await createClient();

  const [
    { data: opportunityRows },
    { data: allProjects },
    { data: favoriteOppsData },
  ] = await Promise.all([
    supabase
      .from("opportunities")
      .select("status, is_favorite")
      .eq("agency_id", agencyId),
    supabase
      .from("projects")
      .select("id, status")
      .eq("agency_id", agencyId),
    supabase
      .from("opportunities")
      .select("id, name, slug, status, company:companies(name)")
      .eq("agency_id", agencyId)
      .eq("is_favorite", true)
      .not("status", "in", '("won","lost")')
      .order("updated_at", { ascending: false })
      .limit(4),
  ]);

  const opps = opportunityRows ?? [];
  const wonCount = opps.filter((o) => o.status === "won").length;
  const lostCount = opps.filter((o) => o.status === "lost").length;
  const activeOpps = opps.filter(
    (o) => o.status !== "won" && o.status !== "lost"
  ).length;
  const closedCount = wonCount + lostCount;
  const conversionRate =
    closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : null;

  const projects = allProjects ?? [];
  const activeProjectsCount = projects.filter((p) => p.status === "active").length;

  const pipelineRows = PIPELINE_STATUSES.map((status) => ({
    status,
    count: opps.filter((o) => o.status === status).length,
  })).filter((r) => r.count > 0);

  const pipelineTotal = pipelineRows.reduce((sum, r) => sum + r.count, 0);

  return {
    activeOpps,
    wonCount,
    lostCount,
    closedCount,
    conversionRate,
    activeProjectsCount,
    totalProjectsCount: projects.length,
    pipelineRows,
    pipelineTotal,
    favoriteOpps: (favoriteOppsData ?? []) as unknown as FavoriteOpp[],
  };
}

export async function getDashboardRecentProjects(agencyId: string): Promise<RecentProject[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("id, name, slug, status, company:companies(name)")
    .eq("agency_id", agencyId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(5);

  return (data ?? []) as unknown as RecentProject[];
}
