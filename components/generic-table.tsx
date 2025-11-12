"use client"

import { useState, useMemo } from "react"
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
                      {onEdit && (
                        <>
                          <DropdownMenuItem onClick={() => onEdit(item)} className="gap-2">
                            <Eye className="h-4 w-4" />
                            Ver/Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(item)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              },
            } as ColumnDef<T>,
          ]
        : []),
    ],
    [columns, showActions, onEdit, onDelete],
  )

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              {onRefresh && (
                <Button
                  variant="outline"
                  onClick={onRefresh}
                  size="sm"
                  className="gap-2 bg-transparent"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Recargar
                </Button>
              )}
              {onNew && (
                <Button onClick={onNew} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder={searchPlaceholder || `Buscar por ${columns[0]?.label.toLowerCase()}...`}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm"
        />
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 py-3 bg-muted/20 rounded-lg border border-border/30">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Badge variant="secondary" className="font-medium">
              {table.getFilteredSelectedRowModel().rows.length} seleccionados
            </Badge>
          )}
          <span>
            <span className="font-semibold text-foreground">{table.getFilteredRowModel().rows.length}</span> {table.getFilteredRowModel().rows.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8"
          >
            Anterior
          </Button>
          <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-background border text-sm">
            <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span>
            <span className="text-muted-foreground">de</span>
            <span className="font-medium">{table.getPageCount()}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
            className="h-8"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
