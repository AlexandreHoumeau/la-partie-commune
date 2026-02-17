"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

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
    <div className="flex items-center justify-between p-1">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Filtrer les opportunités..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
            <MultiSelectFilterDropdown
                label="Status"
                values={ALL_STATUSES}
                selectedValues={statuses}
                setSelectedValues={(vals) => onFilterChange("status", vals)}
                renderItem={(status) => (
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[status].replace("text-", "bg-")}`} />
                        <span>{mapOpportunityStatusLabel[status]}</span>
                    </div>
                )}
            />
             <MultiSelectFilterDropdown
                label="Contact"
                values={ALL_CONTACT_VIA}
                selectedValues={contactVia}
                setSelectedValues={(vals) => onFilterChange("contact_via", vals)}
                renderItem={(method) => (
                    <Badge className={`text-xs ${CONTACT_COLORS[method]}`}>
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
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}