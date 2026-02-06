"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  mapOpportunityStatusLabel,
  OpportunityStatus,
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
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });


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
      pagination
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ---------------------- status filter sync ---------------------- */
  React.useEffect(() => {
    const statusColumn = table.getColumn("status");
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
              const checked = visibleStatuses.includes(status)

              return (
                <div
                  key={status}
                  className="group flex items-center justify-between rounded-sm px-2 py-1.5 hover:bg-accent"
                >
                  <DropdownMenuCheckboxItem
                    checked={checked}
                    onCheckedChange={() => {
                      setVisibleStatuses((prev) =>
                        prev.includes(status)
                          ? prev.filter((s) => s !== status)
                          : [...prev, status]
                      )
                    }}
                    className="flex-1 focus:bg-transparent"
                  >
                    <span
                      className={`mr-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
                    >
                      {mapOpportunityStatusLabel[status]}
                    </span>
                  </DropdownMenuCheckboxItem>

                  {/* Hover action */}
                  <button
                    className="ml-2 hidden text-xs text-muted-foreground hover:text-foreground group-hover:block"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()

                      if (checked) {
                        // Only this status
                        setVisibleStatuses([status])
                      } else {
                        // All statuses
                        setVisibleStatuses(ALL_STATUSES)
                      }
                    }}
                  >
                    {checked ? "Only" : "All"}
                  </button>
                </div>
              )
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
      <div className="flex items-center justify-start space-x-2 py-4">
        <div className="flex items-center justify-between gap-4">
          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
            <Select onValueChange={data => setPagination({ ...pagination, pageSize: Number(data) })} defaultValue={pagination.pageSize.toString()} >
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
                  // href={createPageURL(currentPage - 1)}
                  onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
                  aria-disabled={!table.getCanPreviousPage()}
                  className={
                    !table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  // href={createPageURL(currentPage - 1)}
                  onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
                  aria-disabled={!table.getCanNextPage()}
                  className={
                    !table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined
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
