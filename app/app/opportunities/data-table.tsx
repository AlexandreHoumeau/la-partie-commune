"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  OpportunityStatus,
  mapOpportunityStatusLabel,
} from "@/lib/validators/oppotunities";
import { STATUS_COLORS } from "@/utils/general";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const ALL_STATUSES: OpportunityStatus[] = [
  "to_do",
  "first_contact",
  "second_contact",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
];

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // 👇 TanStack column filter state
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  // 👇 local UI state for checked statuses
  const [visibleStatuses, setVisibleStatuses] =
    React.useState<OpportunityStatus[]>(ALL_STATUSES);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  /* ---------------------- status filter sync ---------------------- */
  React.useEffect(() => {
    const statusColumn = table.getColumn("status");
    console.log(visibleStatuses)
    if (!statusColumn) return;

    // If all statuses are selected → remove filter
    if (visibleStatuses.length === ALL_STATUSES.length) {
      statusColumn.setFilterValue(undefined);
      return;
    }

    // Otherwise filter IN selected statuses
    statusColumn.setFilterValue(visibleStatuses);

  }, [visibleStatuses, table]);

  /* ------------------------------ render ------------------------------ */

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        {/* Email filter */}
        <Input
          placeholder="Filter emails..."
          value={
            (table
              .getColumn("company_email")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("company_email")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Status dropdown filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Statut ({visibleStatuses.length})
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {ALL_STATUSES.map((status) => {
              const checked = visibleStatuses.includes(status);

              return (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={checked}
                  onCheckedChange={() => {
                    setVisibleStatuses((prev) =>
                      prev.includes(status)
                        ? prev.filter((s) => s !== status)
                        : [...prev, status]
                    );
                  }}
                >
                  <span
                    className={`mr-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
                  >
                    {mapOpportunityStatusLabel[status]}
                  </span>
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
            {table.getRowModel().rows.length ? (
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
