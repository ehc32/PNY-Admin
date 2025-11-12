import type React from "react"
export interface DataTableColumn<T> {
  id: string
  label: string
  accessor: keyof T
  sortable?: boolean
  hideable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  isLoading?: boolean
  onNew?: () => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onRefresh?: () => void
  title?: string
  description?: string
  showActions?: boolean
  pageSize?: number
}
