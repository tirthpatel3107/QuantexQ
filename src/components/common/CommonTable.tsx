import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

interface CommonTableProps<TData> {
  table: TanstackTable<TData>;
  noDataMessage?: string;
  className?: string;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  isLightTheme?: boolean;
}

export function CommonTable<TData>({
  table,
  noDataMessage = "No results found.",
  className,
  showPagination = true,
  pageSizeOptions = [5, 10, 20, 50],
  isLightTheme = false,
}: CommonTableProps<TData>) {
  const paginationState = table.getState().pagination;
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === "dark" ? true : false;

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative overflow-hidden",
          isLightTheme &&
            !isDarkTheme &&
            "bg-white dark:bg-transparent border border-border/60 shadow-sm",
        )}
      >
        <Table className="bg-transparent border-collapse table-fixed w-full">
          <TableHeader
            className={cn(
              "bg-muted/50 border-y border-border",
              isLightTheme && !isDarkTheme && "bg-slate-50 border-y-slate-200",
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-none"
              >
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.getSize() }}
                    className={cn(
                      "text-[12px] uppercase tracking-widest font-bold py-3 text-muted-foreground",
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex items-center gap-2 cursor-pointer group hover:text-foreground transition-colors select-none",
                          !header.column.getCanSort() && "flex items-center",
                          index === headerGroup.headers.length - 1 &&
                            "justify-end",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <div className="w-4 h-4 flex items-center justify-center">
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-3 w-3 text-primary" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="h-3 w-3 text-primary" />
                            ) : (
                              <div className="opacity-0 group-hover:opacity-50">
                                <ChevronDown className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "border-b border-border/40 hover:bg-primary/5 transition-all duration-300 group",
                    isLightTheme &&
                      !isDarkTheme &&
                      "border-slate-100 hover:bg-slate-50/50",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className={cn(
                        "py-4",
                        cell.column.id === "actions" && "text-right",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleFlatColumns().length}
                  className="h-32 text-center text-muted-foreground"
                >
                  {noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {table.getRowModel().rows.length > 0 && showPagination && (
        <div className="py-6 flex items-center justify-between">
          <div className="flex-1 flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 px-2 flex items-center gap-2 rounded border border-border bg-white/5 text-[13px] text-foreground hover:border-primary/50 hover:bg-primary/5 shadow-sm transition-all active:scale-95">
                  <span>{paginationState.pageSize} Rows</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[100px] bg-background/95 backdrop-blur-md border-white/10"
              >
                <DropdownMenuLabel className="text-[9px] uppercase tracking-widest text-muted-foreground/50 px-2 py-1.5">
                  Page Size
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                {pageSizeOptions.map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => {
                      table.setPageSize(size);
                    }}
                    className="flex items-center justify-between cursor-pointer px-2 py-1.5 group"
                  >
                    <span
                      className={cn(
                        "text-[11px] transition-colors",
                        paginationState.pageSize === size
                          ? "text-primary font-bold"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {size} Rows
                    </span>
                    {paginationState.pageSize === size && (
                      <Check className="h-3 w-3 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="w-8 h-8 flex items-center justify-center rounded border border-border bg-muted/50 text-muted-foreground hover:text-primary hover:border-primary/50 disabled:cursor-not-allowed transition-all active:scale-95"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
                (pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded border transition-all active:scale-95 text-[11px] font-bold disabled:cursor-not-allowed",
                      paginationState.pageIndex === pageIndex
                        ? "bg-primary text-primary-foreground border-primary shadow-glow"
                        : "border-border bg-muted/50 text-muted-foreground hover:text-primary hover:border-primary/50",
                    )}
                  >
                    {pageIndex + 1}
                  </button>
                ),
              )}
            </div>

            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className="w-8 h-8 flex items-center justify-center rounded border border-border bg-muted/50 text-muted-foreground hover:text-primary hover:border-primary/50 disabled:cursor-not-allowed transition-all active:scale-95"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
