// components/generic-table.tsx
"use client"

import { useState, useMemo, type ReactNode } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Eye, Plus, RefreshCw, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface TableColumn<T> {
  id: string
  label: string
  accessor: keyof T | string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface RowAction<T> {
  id: string
  label: string
  icon?: ReactNode
  destructive?: boolean
  onClick: (item: T) => void
}

export interface ExternalPaginationProps {
  page: number        // página actual (1-based)
  totalPages: number
  totalItems?: number
  onPageChange: (page: number) => void
}

export interface GenericTableProps<T extends { _id?: string; id?: string }> {
  data: T[]
  columns: TableColumn<T>[]
  isLoading?: boolean
  onNew?: () => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onRefresh?: () => void
  title?: string
  description?: string
  showActions?: boolean
  pageSize?: number
  searchPlaceholder?: string
  rowActions?: RowAction<T>[]

  // 👇 NUEVO: paginación manejada fuera (API)
  externalPagination?: ExternalPaginationProps
}

export function GenericTable<T extends { _id?: string; id?: string }>({
  data,
  columns,
  isLoading = false,
  onNew,
  onEdit,
  onDelete,
  onRefresh,
  title,
  description,
  showActions = true,
  pageSize = 10,
  searchPlaceholder,
  rowActions,
  externalPagination,
}: GenericTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const tableColumns: ColumnDef<T>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Seleccionar todo"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Seleccionar fila"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns.map(
        (col) =>
          ({
            id: col.id,
            accessorKey: col.accessor as string,
            accessorFn: col.render ? undefined : (row: any) => row[col.accessor as string],
            header: ({ column }) => {
              if (!col.sortable) return <div className="font-semibold">{col.label}</div>
              return (
                <Button variant="ghost" onClick={() => column.toggleSorting()} className="h-8 px-2 font-semibold">
                  {col.label}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              )
            },
            cell: ({ row }) => {
              if (col.render) {
                const value = (row.original as any)[col.accessor as string]
                return col.render(value, row.original)
              }
              const value = (row.original as any)[col.accessor as string]
              return <div>{String(value ?? "")}</div>
            },
          }) as ColumnDef<T>,
      ),
      ...(showActions
        ? [
          {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
              const item = row.original

              const builtInActions: RowAction<T>[] = []

              if (onEdit) {
                builtInActions.push({
                  id: "edit",
                  label: "Ver/Editar",
                  icon: <Eye className="h-4 w-4" />,
                  onClick: onEdit,
                })
              }

              if (onDelete) {
                builtInActions.push({
                  id: "delete",
                  label: "Eliminar",
                  icon: <Trash2 className="h-4 w-4" />,
                  destructive: true,
                  onClick: onDelete,
                })
              }

              const customActions = rowActions ?? []

              const nonDestructive = [...customActions, ...builtInActions.filter((a) => !a.destructive)]
              const destructive = builtInActions.filter((a) => a.destructive)

              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                    {nonDestructive.map((action) => (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={() => action.onClick(item)}
                        className="gap-2"
                      >
                        {action.icon}
                        {action.label}
                      </DropdownMenuItem>
                    ))}

                    {destructive.length > 0 && <DropdownMenuSeparator />}

                    {destructive.map((action) => (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={() => action.onClick(item)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        {action.icon}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            },
          } as ColumnDef<T>,
        ]
        : []),
    ],
    [columns, showActions, onEdit, onDelete, rowActions],
  )

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // 👇 seguimos usando getPaginationRowModel, pero solo para el caso sin externalPagination
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  const handleSearch = (value: string) => {
    const firstColumn = columns[0]
    if (firstColumn) {
      table.getColumn(firstColumn.id)?.setFilterValue(value)
    }
  }

  // Datos para el footer
  const totalItems =
    externalPagination?.totalItems ?? table.getFilteredRowModel().rows.length

  const currentPage = externalPagination?.page ?? table.getState().pagination.pageIndex + 1
  const totalPages = externalPagination?.totalPages ?? table.getPageCount()

  const goPrev = () => {
    if (externalPagination) {
      if (externalPagination.page > 1) {
        externalPagination.onPageChange(externalPagination.page - 1)
      }
    } else {
      table.previousPage()
    }
  }

  const goNext = () => {
    if (externalPagination) {
      if (externalPagination.page < (externalPagination.totalPages || 1)) {
        externalPagination.onPageChange(externalPagination.page + 1)
      }
    } else {
      table.nextPage()
    }
  }

  const canPrev = externalPagination ? currentPage > 1 : table.getCanPreviousPage()
  const canNext = externalPagination ? currentPage < totalPages : table.getCanNextPage()

  return (
    <div className="space-y-4">
      {/* ... header + filtros igual que antes ... */}

      {/* buscador y selector de columnas */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder={searchPlaceholder || `Buscar por ${columns[0]?.label.toLowerCase()}...`}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm"
        />
        {/* selector de columnas igual */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              Columnas <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* tabla */}
      <div className="rounded-lg border border-border/50 shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-foreground">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {tableColumns.map((_, j) => (
                    <TableCell key={`skeleton-${i}-${j}`}>
                      <div className="h-4 w-full max-w-[140px] rounded bg-muted animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel() && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">No hay datos registrados</p>
                    {onNew && (
                      <Button size="sm" onClick={onNew} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Crear primero
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER PAGINACIÓN */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 py-3 bg-muted/20 rounded-lg border border-border/30">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Badge variant="secondary" className="font-medium">
              {table.getFilteredSelectedRowModel().rows.length} seleccionados
            </Badge>
          )}
          <span>
            <span className="font-semibold text-foreground">{totalItems}</span>{" "}
            {totalItems === 1 ? "registro" : "registros"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={!canPrev}
            className="h-8"
          >
            Anterior
          </Button>
          <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-background border text-sm">
            <span className="font-medium">{currentPage}</span>
            <span className="text-muted-foreground">de</span>
            <span className="font-medium">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={!canNext}
            className="h-8"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
