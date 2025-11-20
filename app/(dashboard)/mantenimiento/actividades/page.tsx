"use client"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { GenericTable, type TableColumn, type RowAction } from "@/components/generic-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  eliminarSolicitudMantenimiento,
  obtenerSolicitudesMantenimiento,
  type MaintenanceRequest,
} from "@/lib/api/maintenance-service"
import { useAuth } from "@/lib/auth-context"
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Filter,
  Loader2,
  Phone,
  ShieldCheck,
  Trash2,
  Wrench,
} from "lucide-react"
import { toast } from "sonner"

const LIMIT = 10

const maintenanceTypes = ["Preventivo", "Correctivo", "Predictivo", "Emergencia", "Desconocido"]

function formatDate(value?: string) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" })
  } catch {
    return value
  }
}

export default function GestionActividadesPage() {
  const { token } = useAuth()
  const [activities, setActivities] = useState<MaintenanceRequest[]>([])
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1 })
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [selected, setSelected] = useState<MaintenanceRequest | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)


 const fetchData = async (page = 1) => {
    if (!token) return
    setIsLoading(true)
    try {
      const response = await obtenerSolicitudesMantenimiento(token, LIMIT, page)
      setActivities(response.data)
      setMeta({
        total: response.total,
        totalPages: response.totalPages,
        page: response.page,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las actividades")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [token])
  const filteredData = useMemo(() => {
    return activities.filter((item) => {
      const matchesType = typeFilter === "all" || item.maintenanceType === typeFilter
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "closed" ? item.workOrderStatus : !item.workOrderStatus)
      return matchesType && matchesStatus
    })
  }, [activities, statusFilter, typeFilter])

  const handleView = (item: MaintenanceRequest) => {
    setSelected(item)
    setViewOpen(true)
  }

  const handleDeleteClick = (item: MaintenanceRequest) => {
    setSelected(item)
    setDeleteOpen(true)
  }

  const router = useRouter()

  // ✅ Acción personalizada: asociar mantenimiento con una OT
  const handleAsignarOrden = (item: MaintenanceRequest) => {
    router.push(`/mantenimiento/actividades/programar/${item._id}`)
  }

  const handleDelete = async () => {
    if (!selected || !token) return
    setIsDeleting(true)
    try {
      await eliminarSolicitudMantenimiento(token, selected._id!)
      toast.success("Actividad eliminada correctamente")
      setDeleteOpen(false)
      fetchData(meta.page)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la actividad")
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: TableColumn<MaintenanceRequest>[] = [
    {
      id: "requesterName",
      label: "Solicitante",
      accessor: "requesterName",
      sortable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <p className="font-medium text-slate-900">{value}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            <span>{row.requesterPhone || "Sin teléfono"}</span>
          </div>
        </div>
      ),
    },
    {
      id: "trackingNumber",
      label: "Radicado",
      accessor: "trackingNumber",
      render: (value) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {value || "Pendiente"}
        </Badge>
      ),
    },
    {
      id: "equipment",
      label: "Equipo",
      accessor: "serialNumber",
      render: (_, row) => (
        <div className="space-y-1">
          <div className="font-medium">{row.serialNumber}</div>
          <p className="text-xs text-muted-foreground">
            {row.InventoryCode || row.InventoryCode || "Sin inventario"}
          </p>
        </div>
      ),
    },
    {
      id: "maintenanceType",
      label: "Tipo",
      accessor: "maintenanceType",
      render: (value) => (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-100">
          {value}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      label: "Creado",
      accessor: "createdAt",
      render: (value) => (
        <div className="flex items-center gap-2 text-sm">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(value)}</span>
        </div>
      ),
    },
    {
      id: "workOrderStatus",
      label: "Estado",
      accessor: "workOrderStatus",
      render: (value) =>
        value ? (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Asignado</Badge>
        ) : (
          <Badge variant="destructive" className=" text-amber-700 bg-amber-100">
            Sin Asignar
          </Badge>
        ),
    },

  ]

  const resolved = activities.filter((item) => item.workOrderStatus).length
  const pending = activities.length - resolved

  const rowActions: RowAction<MaintenanceRequest>[] = [
    {
      id: "asociar-mantenimiento",
      label: "Asociar mantenimiento",
      icon: <Wrench className="h-4 w-4" />,
      onClick: handleAsignarOrden,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Cards de resumen (comentadas) */}
      {/* ... */}

      <Card className="s shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <CardTitle className="text-xl">Gestión de Actividades</CardTitle>
              <CardDescription>
                Consulta, filtra, visualiza y depura las órdenes de mantenimiento registradas.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground border rounded-lg px-3 py-2 bg-muted/40">
                <Filter className="h-4 w-4" />
                <span>Filtros activos</span>
              </div>
              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val)}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {maintenanceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="open">En progreso</SelectItem>
                  <SelectItem value="closed">Resuelta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
           <CardContent>
          <GenericTable
            data={filteredData}
            columns={columns}
            isLoading={isLoading}
            onEdit={handleView}
            onDelete={handleDeleteClick}
            onRefresh={() => fetchData(meta.page)}
            title=""
            description=""
            showActions
            pageSize={LIMIT}
            searchPlaceholder="Buscar por solicitante..."
            rowActions={rowActions}
            externalPagination={{
              page: meta.page,
              totalPages: meta.totalPages,
              totalItems: meta.total,
              onPageChange: (page) => {
                fetchData(page)
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Dialog de ver detalle */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Detalle de actividad</DialogTitle>
            <DialogDescription>Información completa de la solicitud seleccionada.</DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="grid gap-4 md:grid-cols-2 py-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Solicitante</p>
                <p className="font-semibold">{selected.requesterName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="font-medium">{selected.requesterPhone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Radicado</p>
                <Badge variant="secondary" className="font-mono text-xs">
                  {selected.trackingNumber || "Pendiente"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Tipo</p>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-100">
                  {selected.maintenanceType}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Equipo</p>
                <p className="font-medium">{selected.serialNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.InventoryCode || selected.InventoryCode || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Estado</p>
                {selected.workOrderStatus ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Resuelta</Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">
                    En progreso
                  </Badge>
                )}
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="text-xs text-muted-foreground">Descripción</p>
                <p className="text-sm leading-relaxed text-slate-800">{selected.issueDescription}</p>
              </div>
              <div className="md:col-span-2 flex gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  Creada: {formatDate(selected.createdAt)}
                </div>
                {selected.updatedAt && (
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    Actualizada: {formatDate(selected.updatedAt)}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de eliminar */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Eliminar actividad</DialogTitle>
            <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">
              ¿Seguro que deseas eliminar la solicitud
              {selected ? ` "${selected.trackingNumber || selected.serialNumber}"` : ""}? Esta acción eliminará el
              registro de la tabla.
            </p>
          </div>

          <DialogFooter className="flex justify-end gap-2 sm:gap-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
