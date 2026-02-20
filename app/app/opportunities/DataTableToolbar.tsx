"use client";

import { Table } from "@tanstack/react-table";
import { Search, X, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ALL_CONTACT_VIA,
  ALL_STATUSES,
  ContactVia,
  OpportunityStatus,
  mapContactViaLabel,
  mapOpportunityStatusLabel
} from "@/lib/validators/oppotunities";
import { MultiSelectFilterDropdown } from "@/components/table/MultiSelectFilterDropdown";
import { CONTACT_COLORS, STATUS_COLORS } from "@/utils/general";
import { Badge } from "@/components/ui/badge";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchInput: string;
  setSearchInput: (value: string) => void;
  statuses: OpportunityStatus[];
  contactVia: ContactVia[];
  onFilterChange: (key: string, values: string[]) => void;
}

export function DataTableToolbar<TData>({
  table,
  searchInput,
  setSearchInput,
  statuses,
  contactVia,
  onFilterChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = statuses.length > 0 || contactVia.length > 0 || searchInput.length > 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2 bg-white">
      {/* Search Input - Style SaaS avec icône intégrée */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Rechercher une entreprise, un contact..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500 rounded-xl text-sm transition-all"
        />
      </div>

      {/* Filters Area */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-slate-50/50 p-1 rounded-xl border border-slate-100">
          <div className="px-3 flex items-center gap-2 border-r border-slate-200">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Filtres</span>
          </div>

          <MultiSelectFilterDropdown
            label="Statut"
            values={ALL_STATUSES}
            selectedValues={statuses}
            setSelectedValues={(vals) => onFilterChange("status", vals)}
            renderItem={(status) => (
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[status].replace("text-", "bg-")}`} />
                <span className="text-xs font-medium">{mapOpportunityStatusLabel[status]}</span>
              </div>
            )}
          />
          <MultiSelectFilterDropdown
            label="Canal"
            values={ALL_CONTACT_VIA}
            selectedValues={contactVia}
            setSelectedValues={(vals) => onFilterChange("contact_via", vals)}
            renderItem={(method) => (
              <Badge className={`text-[10px] uppercase tracking-wider ${CONTACT_COLORS[method]}`}>
                {mapContactViaLabel[method]}
              </Badge>
            )}
          />
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchInput("");
              onFilterChange("status", []);
              onFilterChange("contact_via", []);
            }}
            className="h-10 px-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          >
            Réinitialiser
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}