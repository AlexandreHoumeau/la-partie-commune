"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Field, FieldLabel } from "@/components/ui/field";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ALL_CONTACT_VIA,
  ALL_STATUSES,
  ContactVia,
  mapContactViaLabel,
  mapOpportunityStatusLabel,
  OpportunityStatus,
} from "@/lib/validators/oppotunities";
import { CONTACT_COLORS, STATUS_COLORS } from "@/utils/general";

import { MultiSelectFilterDropdown } from "@/components/table/MultiSelectFilterDropdown";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  statuses: OpportunityStatus[];
  contactVia: ContactVia[];
  isLoading: boolean;
  onSearch: (search: string) => void;
  onFilterChange: (key: string, values: string[]) => void;
  onPagination: (page: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total,
  page,
  pageSize,
  search,
  statuses,
  contactVia,
  isLoading,
  onSearch,
  onFilterChange,
  onPagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [searchInput, setSearchInput] = React.useState(search);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        onSearch(searchInput);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, search, onSearch]);

  // Sync search input with URL
  React.useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
  });

  const handlePreviousPage = () => {
    if (page > 1) {
      onPagination(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * pageSize < total) {
      onPagination(page + 1);
    }
  };

  const handlePageSizeChange = (value: string) => {
    onFilterChange("pageSize", [value]);
  };

  // Handlers for filters
  const handleContactViaChange = (values: ContactVia[]) => {
    onFilterChange("contact_via", values);
  };

  const handleStatusChange = (values: OpportunityStatus[]) => {
    onFilterChange("status", values);
  };

  return (
    <div>
      {/* Search and filters */}
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Rechercher par email, nom d'opportunité ou entreprise..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-sm"
        />
        <div className="gap-4 flex">
          <MultiSelectFilterDropdown
            label="Contact via"
            values={ALL_CONTACT_VIA}
            selectedValues={contactVia}
            setSelectedValues={handleContactViaChange}
            renderItem={(method) => (
              <span className={`mr-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${CONTACT_COLORS[method]}`}>
                {mapContactViaLabel[method]}
              </span>
            )}
          />
          <MultiSelectFilterDropdown
            label="Statut"
            values={ALL_STATUSES}
            selectedValues={statuses}
            setSelectedValues={handleStatusChange}
            renderItem={(status) => (
              <span className={`mr-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
                {mapOpportunityStatusLabel[status]}
              </span>
            )}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-neutral-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucune opportunité trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-start space-x-2 py-4">
        <div className="flex items-center justify-between gap-4">
          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">Lignes par page</FieldLabel>
            <Select
              onValueChange={handlePageSizeChange}
              value={pageSize.toString()}
            >
              <SelectTrigger className="w-20" id="select-rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  aria-disabled={page === 1}
                  className={
                    page === 1 ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  aria-disabled={page * pageSize >= total}
                  className={
                    page * pageSize >= total ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}