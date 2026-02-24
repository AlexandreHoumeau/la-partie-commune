"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  CompanyTab,
  CompanySortKey,
  DEFAULT_TAB,
  DEFAULT_SORT,
  DEFAULT_PAGE_SIZE,
} from "@/lib/validators/companies";
import { fetchCompanies, fetchCompanySectors } from "@/actions/companies.server";

type UseCompaniesOptions = {
  agencyId: string;
  enabled?: boolean;
};

export function useCompanies({ agencyId, enabled = true }: UseCompaniesOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const tab = (searchParams.get("tab") || DEFAULT_TAB) as CompanyTab;
  const sort = (searchParams.get("sort") || DEFAULT_SORT) as CompanySortKey;
  const sectorsParam = searchParams.get("sectors");
  const sectors = sectorsParam ? sectorsParam.split(",") : [];
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(
    searchParams.get("pageSize") || DEFAULT_PAGE_SIZE.toString(),
    10
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["companies", { agencyId, search, tab, sectors, sort, page, pageSize }],
    queryFn: () =>
      fetchCompanies({ agencyId, search, tab, sectors, sort, page, pageSize }),
    enabled: enabled && !!agencyId,
    staleTime: 30000,
  });

  const { data: availableSectors } = useQuery({
    queryKey: ["companies-sectors", agencyId],
    queryFn: () => fetchCompanySectors(agencyId),
    enabled: enabled && !!agencyId,
    staleTime: 60000,
  });

  const updateURL = (updates: Record<string, string | string[]>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          params.delete(key);
        } else {
          params.set(key, value.join(","));
        }
      } else if (
        !value ||
        (key === "tab" && value === DEFAULT_TAB) ||
        (key === "sort" && value === DEFAULT_SORT) ||
        (key === "page" && value === "1") ||
        (key === "pageSize" && value === DEFAULT_PAGE_SIZE.toString())
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    companies: data?.companies ?? [],
    total: data?.total ?? 0,
    allCount: data?.allCount ?? 0,
    clientsCount: data?.clientsCount ?? 0,
    prospectsCount: data?.prospectsCount ?? 0,
    availableSectors: availableSectors ?? [],
    search,
    tab,
    sectors,
    sort,
    page,
    pageSize,
    isLoading,
    error,
    updateURL,
  };
}
