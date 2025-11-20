"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import {
  AlertCircle,
  CalendarClock,
  ClipboardList,
  Eye,
  Loader2,
  MapPin,
  Phone,
  Trash2,
  Wrench,
} from "lucide-react"

import {
  obtenerOrdenesTrabajo,
  eliminarOrdenTrabajo,
  type WorkOrder,
} from "@/lib/api/create-Orden"

const LIMIT = 10

function formatDate(value?: string) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  } catch {
    return value
  }
}

export default function OrdenesTrabajoPage() {
  const { token } = useAuth()
  const router = useRouter()

  const [orders, setOrders] = useState<WorkOrder[]>([])
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1 })
  const [isLoading, setIsLoading] = useState(false)

  const [selected, setSelected] = useState<WorkOrder | null>(null)
  const [viewOpen, setViewOpen] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchOrders = async (page = 1) => {
    if (!token) return
    setIsLoading(true)
    try {
      const res = await obtenerOrdenesTrabajo(token, LIMIT, page)
      setOrders(res.data)
      setMeta({
        total: res.total,
        totalPages: res.totalPages,
        page: res.page,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las órdenes de trabajo")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(1)
  }, [token])

  // Si quisieras filtrar por algo en memoria, aquí…
  const tableData = useMemo(() => orders, [orders])

  const handleView = (item: WorkOrder) => {
    setSelected(item)
    setViewOpen(true)
  }

  const handleDeleteClick = (item: WorkOrder) => {
    setSelected(item)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!selected || !token) return
    setIsDeleting(true)
    try {
      await eliminarOrdenTrabajo(token, selected._id)
      toast.success("Orden de trabajo eliminada correctamente")
      setDeleteOpen(false)

      // Si borras el último en la página, retrocede una
      const pageToFetch =
        orders.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page

      await fetchOrders(pageToFetch)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la orden de trabajo")
    } finally {
      setIsDeleting(false)
    }
  }

  // Acción custom: Realizar informe
  const handleRealizarInforme = (item: WorkOrder) => {
    // Aquí puedes cambiar la ruta a la que quieras
    router.push(`/mantenimiento/ordenes-trabajo/${item._id}/realizar`)
  }

  // Columnas de la tabla
  const columns: TableColumn<WorkOrder>[] = [
    {
      id: "radicado",
      label: "Radicado",
      accessor: "radicado",
      sortable: true,
      render: (value) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {value}
        </Badge>
      ),
    },
    {
      id: "equipo",
      label: "Equipo",
      accessor: "solicitud",
      render: (_, row) => (
        <div className="space-y-1">
          <p className="font-medium">
            {row.solicitud.asset?.name ?? "Equipo sin nombre"}
          </p>
          <p className="text-xs text-muted-foreground">
            Serie: {row.solicitud.serialNumber} · Radicado: {row.solicitud.trackingNumber}
          </p>
        </div>
      ),
    },
    {
      id: "tecnico",
      label: "Técnico",
      accessor: "tecnicoId",
      render: (_, row) => (
        <div className="space-y-1">
          <p className="font-medium">{row.tecnicoId?.name}</p>
          {row.tecnicoId?.phone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{row.tecnicoId.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "prioridad",
      label: "Prioridad",
      accessor: "prioridad",
      render: (value: WorkOrder["prioridad"]) => {
        const p = value?.toLowerCase?.() ?? ""
        if (p === "alta") {
          return (
            <Badge className="bg-red-200 text-slate-900 border border-red-300">
              Alta
            </Badge>
          )
        }
        if (p === "media") {
          return (
            <Badge className="bg-amber-200 text-slate-900 border border-amber-300">
              Media
            </Badge>
          )
        }
        if (p === "baja") {
          return (
            <Badge className="bg-emerald-200 text-slate-900 border border-emerald-300">
              Baja
            </Badge>
          )
        }
        return (
          <Badge variant="outline" className="text-slate-800">
            {value}
          </Badge>
        )
      },
    },
    {
      id: "fechas",
      label: "Fechas",
      accessor: "fechaInicio",
      render: (_, row) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              Inicio: <span className="font-medium">{formatDate(row.fechaInicio)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              Fin: <span className="font-medium">{formatDate(row.fechaFin)}</span>
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "estadoTiempo",
      label: "Estado",
      accessor: "estadoTiempo",
      render: (_, row) => {
        const e = row.estadoTiempo
        if (!e) {
          return (
            <Badge className="bg-slate-200 text-slate-900 border border-slate-300">
              Sin información
            </Badge>
          )
        }

        if (e.estaFinalizada || row.state) {
          return (
            <Badge className="bg-emerald-200 text-slate-900 border border-emerald-300">
              Finalizada
            </Badge>
          )
        }

        if (e.estaVencida) {
          return (
            <Badge className="bg-red-200 text-slate-900 border border-red-300">
              Vencida ({e.diasRetraso} días)
            </Badge>
          )
        }

        if (e.estaProximaAVencer) {
          return (
            <Badge className="bg-amber-200 text-slate-900 border border-amber-300">
              Próxima a vencer ({e.diasRestantes} días)
            </Badge>
          )
        }

        return (
          <Badge className="bg-sky-200 text-slate-900 border border-sky-300">
            En curso ({e.diasRestantes} días restantes)
          </Badge>
        )
      },
    },
  ]

  const rowActions: RowAction<WorkOrder>[] = [
    {
      id: "ver-detalle",
      label: "Ver detalle",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleView,
    },
    {
      id: "realizar-informe",
      label: "Realizar informe",
      icon: <ClipboardList className="h-4 w-4" />,
      onClick: handleRealizarInforme,
    },
    {
      id: "eliminar",
      label: "Eliminar",
      icon: <Trash2 className="h-4 w-4" />,
      destructive: true,
      onClick: handleDeleteClick,
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl">Órdenes de trabajo</CardTitle>
              <CardDescription>
                Consulta, gestiona y documenta las órdenes de mantenimiento asignadas a los técnicos.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wrench className="h-4 w-4" />
              <span>{meta.total} órdenes registradas</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={tableData}
            columns={columns}
            isLoading={isLoading}
            showActions
            pageSize={LIMIT}
            searchPlaceholder="Buscar por radicado o equipo..."
            rowActions={rowActions}
            externalPagination={{
              page: meta.page,
              totalPages: meta.totalPages,
              totalItems: meta.total,
              onPageChange: (page) => {
                fetchOrders(page)
              },
            }}
          />
        </CardContent>
      </Card>

      {/* DIALOG DETALLE */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Detalle de orden de trabajo
            </DialogTitle>
            <DialogDescription>
              Información completa de la orden seleccionada.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="grid gap-4 md:grid-cols-2 py-2">
              {/* Columna izquierda */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Radicado</p>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selected.radicado}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Técnico asignado</p>
                  <p className="font-medium">{selected.tecnicoId?.name}</p>
                  {selected.tecnicoId?.phone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{selected.tecnicoId.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                  <p className="font-medium">{selected.instructorId?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selected.instructorId?.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Prioridad</p>
                  {columns.find((c) => c.id === "prioridad")?.render?.(
                    selected.prioridad,
                    selected,
                  )}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Estado</p>
                  {columns.find((c) => c.id === "estadoTiempo")?.render?.(
                    selected.estadoTiempo,
                    selected,
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Equipo</p>
                  <p className="font-medium">
                    {selected.solicitud.asset?.name ?? "Equipo sin nombre"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Serie: {selected.solicitud.serialNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Radicado solicitud: {selected.solicitud.trackingNumber}
                  </p>
                </div>

                {selected.solicitud.asset?.location && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3.5 w-3.5" />
                    <span>{selected.solicitud.asset.location}</span>
                  </div>
                )}

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>
                      Inicio:{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(selected.fechaInicio)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>
                      Fin:{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(selected.fechaFin)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG ELIMINAR */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Eliminar orden de trabajo</DialogTitle>
            <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">
              ¿Seguro que deseas eliminar la orden
              {selected ? ` "${selected.radicado}"` : ""}? Esta acción eliminará el registro de la tabla.
            </p>
          </div>

          <DialogFooter className="flex justify-end gap-2 sm:gap-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
