"use client"

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import {
  AlertCircle,
  CalendarClock,
  ClipboardList,
  FileDown,
  Loader2,
  Trash2,
  User,
  Wrench,
} from "lucide-react"

import {
  obtenerInformesTrabajo,
  eliminarInformeTrabajo,
  actualizarInformeTrabajo,
  type WorkReport,
} from "@/lib/api/work-report-service"
import { WorkReportLetterPdf } from "@/components/pdf/WorkReportLetterPdf"
import { pdf } from "@react-pdf/renderer"

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

export default function GestionInformesPage() {
  const { token } = useAuth()

  const [reports, setReports] = useState<WorkReport[]>([])
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1 })
  const [isLoading, setIsLoading] = useState(false)

  const [selected, setSelected] = useState<WorkReport | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // formulario editable
  const [form, setForm] = useState({
    hours: 0,
    workDone: "",
    responses: "",
    observation: "",
    costs: "" as string, // string para el input, luego lo parseamos a number
    status: true,
  })

  const fetchReports = async (page = 1) => {
    if (!token) return
    setIsLoading(true)
    try {
      const res = await obtenerInformesTrabajo(token, LIMIT, page)
      setReports(res.data)
      setMeta({
        total: res.total,
        totalPages: res.totalPages,
        page: res.page,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los informes")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports(1)
  }, [token])

  const tableData = useMemo(() => reports, [reports])

  const openEditModal = (item: WorkReport) => {
    setSelected(item)
    setForm({
      hours: item.hours ?? 0,
      workDone: item.workDone ?? "",
      responses: item.responses ?? "",
      observation: item.observation ?? "",
      costs: item.costs != null ? String(item.costs) : "",
      status: item.status ?? true,
    })
    setEditOpen(true)
  }

  const handleDeleteClick = (item: WorkReport) => {
    setSelected(item)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!selected || !token) return
    setIsDeleting(true)
    try {
      await eliminarInformeTrabajo(token, selected._id)
      toast.success("Informe eliminado correctamente")
      setDeleteOpen(false)
      setEditOpen(false)

      const pageToFetch =
        reports.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page

      await fetchReports(pageToFetch)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el informe")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = async () => {
    if (!selected || !token) return
    setIsSaving(true)
    try {
      const costsNumber =
        form.costs.trim() === "" ? null : Number.isNaN(Number(form.costs)) ? null : Number(form.costs)

      const payload = {
        hours: form.hours,
        workDone: form.workDone,
        responses: form.responses,
        observation: form.observation,
        costs: costsNumber,
        status: form.status,
      }

      await actualizarInformeTrabajo(token, selected._id, payload)

      toast.success("Informe actualizado correctamente")
      setEditOpen(false)
      await fetchReports(meta.page)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el informe")
    } finally {
      setIsSaving(false)
    }
  }

 const handleDescargarPdf = async (item: WorkReport) => {
  try {
    const blob = await pdf(<WorkReportLetterPdf report={item} />).toBlob()

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${item.Informe || "informe-mantenimiento"}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
    toast.error("No se pudo generar el PDF del informe")
  }
}
  const columns: TableColumn<WorkReport>[] = [
    {
      id: "Informe",
      label: "Informe",
      accessor: "Informe",
      sortable: true,
      render: (value) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {value}
        </Badge>
      ),
    },
    {
      id: "orden",
      label: "Orden de trabajo",
      accessor: "orderId",
      render: (_, row) => (
        <div className="space-y-1">
          <p className="font-medium">{row.orderId?.radicado}</p>
          <p className="text-xs text-muted-foreground">
            Inventario: {row.orderId?.solicitud?.InventoryCode ?? "—"}
          </p>
        </div>
      ),
    },
    {
      id: "tecnico",
      label: "Técnico",
      accessor: "orderId",
      render: (_, row) => (
        <div className="space-y-1">
          <p className="font-medium">{row.orderId?.tecnicoId?.name}</p>
        </div>
      ),
    },
    {
      id: "encargado",
      label: "Encargado", // 👈 antes "instructor"
      accessor: "orderId",
      render: (_, row) => (
        <div className="space-y-1">
          <p className="font-medium">{row.orderId?.instructorId?.name}</p>
        </div>
      ),
    },
    {
      id: "hours",
      label: "Horas",
      accessor: "hours",
      render: (value) => (
        <span className="text-sm font-medium">{value} h</span>
      ),
    },
    {
      id: "status",
      label: "Estado",
      accessor: "status",
      render: (value: boolean) =>
        value ? (
          <Badge className="bg-emerald-200 text-slate-900 border border-emerald-300">
            Cerrado
          </Badge>
        ) : (
          <Badge className="bg-amber-200 text-slate-900 border border-amber-300">
            En proceso
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
  ]

  const rowActions: RowAction<WorkReport>[] = [
    {
      id: "ver-editar",
      label: "Ver / Editar",
      icon: <ClipboardList className="h-4 w-4" />,
      onClick: openEditModal,
    },
    {
      id: "descargar-pdf",
      label: "Descargar PDF",
      icon: <FileDown className="h-4 w-4" />,
      onClick: handleDescargarPdf,
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
              <CardTitle className="text-xl">Gestión de informes</CardTitle>
              <CardDescription>
                Consulta, edita y administra los informes de las órdenes de trabajo.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wrench className="h-4 w-4" />
              <span>{meta.total} informes registrados</span>
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
            searchPlaceholder="Buscar por informe u orden de trabajo..."
            rowActions={rowActions}
            externalPagination={{
              page: meta.page,
              totalPages: meta.totalPages,
              totalItems: meta.total,
              onPageChange: (page) => {
                fetchReports(page)
              },
            }}
          />
        </CardContent>
      </Card>

      {/* MODAL VER / EDITAR */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Detalle del informe
            </DialogTitle>
            <DialogDescription>
              Revisa y edita la información del informe. También puedes eliminarlo si es necesario.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="grid gap-5 md:grid-cols-2 py-2">
              {/* Columna izquierda: info fija */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Código de informe</p>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {selected.Informe}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Orden de trabajo</p>
                  <p className="font-medium">{selected.orderId?.radicado}</p>
                  <p className="text-xs text-muted-foreground">
                    Inventario: {selected.orderId?.solicitud?.InventoryCode ?? "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Técnico</p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    {selected.orderId?.tecnicoId?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Encargado / Aprobador</p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    {selected.orderId?.instructorId?.name}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>
                      Creado:{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(selected.createdAt)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>
                      Actualizado:{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(selected.updatedAt)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Columna derecha: formulario editable */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="hours">Horas trabajadas</Label>
                    <Input
                      id="hours"
                      type="number"
                      min={0}
                      value={form.hours}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, hours: Number(e.target.value) }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="costs">Costos (opcional)</Label>
                    <Input
                      id="costs"
                      type="number"
                      min={0}
                      value={form.costs}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, costs: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="workDone">Trabajo realizado</Label>
                  <Textarea
                    id="workDone"
                    rows={3}
                    value={form.workDone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, workDone: e.target.value }))
                    }
                    placeholder="Describe el trabajo realizado..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="responses">Respuestas / acciones</Label>
                  <Textarea
                    id="responses"
                    rows={3}
                    value={form.responses}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, responses: e.target.value }))
                    }
                    placeholder="Acciones específicas, tareas ejecutadas, etc."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="observation">Observaciones</Label>
                  <Textarea
                    id="observation"
                    rows={3}
                    value={form.observation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, observation: e.target.value }))
                    }
                    placeholder="Notas adicionales, observaciones del técnico o encargado..."
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Marcar como cerrado</p>
                    <p className="text-xs text-muted-foreground">
                      Indica si el informe y la orden asociada están totalmente finalizados.
                    </p>
                  </div>
                  <Switch
                    checked={form.status}
                    onCheckedChange={(value) =>
                      setForm((f) => ({ ...f, status: value }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <Button
              variant="outline"
              className="text-destructive border-destructive/40 order-2 sm:order-1"
              onClick={() => setDeleteOpen(true)}
            >
              Eliminar informe
            </Button>
            <div className="flex gap-2 justify-end w-full sm:w-auto order-1 sm:order-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Guardar cambios
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG ELIMINAR */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Eliminar informe</DialogTitle>
            <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">
              ¿Seguro que deseas eliminar el informe
              {selected ? ` "${selected.Informe}"` : ""}? Esta acción eliminará el registro de la tabla.
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
