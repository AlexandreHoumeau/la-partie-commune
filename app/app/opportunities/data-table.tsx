"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ContactVia, OpportunityStatus } from "@/lib/validators/oppotunities";
import { DataTableToolbar } from "./DataTableToolbar";
import { cn } from "@/lib/utils";

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

  // Sync state
  React.useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        statuses={statuses}
        contactVia={contactVia}
        onFilterChange={onFilterChange}
      />

      {/* TABLE CONTAINER */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-slate-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} className="h-11 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400 text-sm animate-pulse">
                  Chargement des données...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400 text-sm">
                  Aucune opportunité trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION PREMIUM */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/30 rounded-xl border border-slate-100">
        <div className="flex-1 text-xs font-medium text-slate-500">
          <span className="text-slate-900 font-bold">{data.length}</span> sur <span className="text-slate-900 font-bold">{total}</span> opportunités
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span className="ml-1 text-blue-600">
              ({table.getFilteredSelectedRowModel().rows.length} sélectionnée(s))
            </span>
          )}
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Lignes</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => onFilterChange("pageSize", [value])}
            >
              <SelectTrigger className="h-8 w-[70px] rounded-lg border-slate-200 bg-white focus:ring-blue-500">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top" className="rounded-xl shadow-xl">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`} className="text-xs">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-xs font-bold text-slate-700">
            Page {page} / {Math.ceil(total / pageSize)}
          </div>

          <div className="flex items-center space-x-1.5">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 hover:border-blue-200"
              onClick={() => onPagination(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 hover:border-blue-200"
              onClick={() => onPagination(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 hover:border-blue-200"
              onClick={() => onPagination(page + 1)}
              disabled={page * pageSize >= total}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex rounded-lg border-slate-200 hover:bg-white hover:text-blue-600 hover:border-blue-200"
              onClick={() => onPagination(Math.ceil(total / pageSize))}
              disabled={page * pageSize >= total}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}