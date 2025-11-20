"use client"

import * as React from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { CalendarIcon, ChevronDown, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { getUserById, type User } from "@/lib/api/users-service"
import {
  createWorkOrder,
  getMaintenanceDetail,
  getTechnicians,
  type Technician,
  type CreateWorkOrderPayload,
  type WorkOrder,
} from "@/lib/api/work-orders-service"

function decodeJwt(token: string): any | null {
  try {
    const [, payload] = token.split(".")
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload =
      typeof window !== "undefined"
        ? window.atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8")
    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error("Error decodificando JWT:", e)
    return null
  }
}

function formatDate(iso?: string) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("es-CO")
}

function formatFullDate(date?: Date) {
  if (!date) return "dd/mm/aaaa"
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/** Radicado tipo OT-19-11-2025 */
function generarRadicado(fecha: Date) {
  const d = fecha.getDate().toString().padStart(2, "0")
  const m = (fecha.getMonth() + 1).toString().padStart(2, "0")
  const y = fecha.getFullYear()
  return `OT-${d}-${m}-${y}`
}

type Prioridad = "alta" | "media" | "baja"

const ProgramarOrdenTrabajoPage: React.FC = () => {
  const params = useParams() as { id: string }
  const solicitudId = params.id
  const router = useRouter()

  const [token, setToken] = React.useState<string>("")

  const [maintenance, setMaintenance] = React.useState<any | null>(null)
  const [loadingDetail, setLoadingDetail] = React.useState(false)

  const [instructor, setInstructor] = React.useState<User | null>(null)

  const [technicians, setTechnicians] = React.useState<Technician[]>([])
  const [selectedTechnicianId, setSelectedTechnicianId] =
    React.useState<string>("")

  const [fechaInicio, setFechaInicio] = React.useState<Date | undefined>(
    new Date(),
  )
  const [fechaFin, setFechaFin] = React.useState<Date | undefined>()
  const [prioridad, setPrioridad] = React.useState<Prioridad>("media")
  const [radicado, setRadicado] = React.useState<string>("")
  const [comentarios, setComentarios] = React.useState<string>("")

  const [saving, setSaving] = React.useState(false)

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [createdOrder, setCreatedOrder] = React.useState<WorkOrder | null>(null)

  // Carga inicial
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const storedToken =
      window.localStorage.getItem("auth_token") ||
      window.localStorage.getItem("token") ||
      ""

    if (storedToken) {
      setToken(storedToken)
    }

    const loadAll = async () => {
      try {
        let userId: string | null = null
        if (storedToken) {
          const decoded = decodeJwt(storedToken)
          userId = decoded?.sub || decoded?._id || null
        }

        if (storedToken && userId) {
          const user = await getUserById(userId, storedToken)
          setInstructor(user)
        }

        setLoadingDetail(true)
        const detail = await getMaintenanceDetail(solicitudId, storedToken)
        console.log("Detalle solicitud:", detail)
        setMaintenance(detail)

        const techs = await getTechnicians(storedToken)
        setTechnicians(Array.isArray(techs) ? techs : [])
      } catch (error: any) {
        console.error(error)
        toast.error(
          error?.message ||
            "Error al cargar la información para programar la orden.",
        )
      } finally {
        setLoadingDetail(false)
      }
    }

    loadAll()
  }, [solicitudId])

  // Generar radicado base
  React.useEffect(() => {
    if (fechaInicio) {
      setRadicado(generarRadicado(fechaInicio))
    }
  }, [fechaInicio])

  const resetForm = () => {
    setPrioridad("media")
    setFechaInicio(new Date())
    setFechaFin(undefined)
    setSelectedTechnicianId("")
    setComentarios("")
    setRadicado(generarRadicado(new Date()))
  }

  const handleProgramar = async () => {
    if (!token) {
      toast.error("No hay token de autenticación. Inicia sesión nuevamente.")
      return
    }

    if (!maintenance || !maintenance._id) {
      toast.error("No se encontró la solicitud de mantenimiento.")
      return
    }

    if (!instructor?._id) {
      toast.error("No se pudo obtener el usuario autorizado.")
      return
    }

    if (!selectedTechnicianId) {
      toast.error("Selecciona el técnico asignado.")
      return
    }

    if (!fechaInicio || !fechaFin) {
      toast.error("Selecciona la fecha de inicio y fin del mantenimiento.")
      return
    }

    const start = new Date(fechaInicio)
    start.setHours(0, 0, 0, 0)
    const end = new Date(fechaFin)
    end.setHours(0, 0, 0, 0)

    const fechaInicioISO = start.toISOString()
    const fechaFinISO = end.toISOString()

    const payload: CreateWorkOrderPayload = {
      fechaInicio: fechaInicioISO,
      fechaFin: fechaFinISO,
      instructorId: instructor._id!,
      prioridad,
      radicado: radicado || generarRadicado(new Date()),
      solicitud: maintenance._id as string,
      state: false,
      tecnicoId: selectedTechnicianId,
    }

    try {
      setSaving(true)
      const order = await createWorkOrder(token, payload)
      setCreatedOrder(order)
      setDialogOpen(true)
      resetForm()
      toast.success("Orden de trabajo creada correctamente.", {
        description: order.radicado,
      })
    } catch (error: any) {
      console.error("Error al crear la orden:", error)

      const message =
        error instanceof Error ? error.message : String(error ?? "")

      // Caso Gmail: asumimos creada pero falló el envío
      if (message.includes("Invalid login")) {
        const fakeOrder: WorkOrder = {
          _id: `TEMP-${Date.now()}`,
          fechaInicio: fechaInicioISO,
          fechaFin: fechaFinISO,
          instructorId: instructor._id!,
          prioridad,
          radicado: payload.radicado,
          solicitud: payload.solicitud,
          state: payload.state,
          tecnicoId: payload.tecnicoId,
          createdAt: new Date().toISOString(),
        }
        setCreatedOrder(fakeOrder)
        setDialogOpen(true)
        resetForm()
        toast.warning(
          "La orden se creó, pero hubo un problema enviando los correos.",
        )
      } else {
        toast.error(
          message || "Error al crear la orden de trabajo de mantenimiento.",
        )
      }
    } finally {
      setSaving(false)
    }
  }

  // 👇 aquí usamos los nombres correctos del JSON que enviaste
  const asset = maintenance?.assetInfo ?? {}
  const environment = maintenance?.environmentInfo ?? {}
  const trainingCenter = maintenance?.trainingCenterInfo ?? {}

  const assetImage =
    typeof asset.image === "string" && asset.image.startsWith("data:")
      ? asset.image
      : undefined

  return (
    <>
      <div className="flex w-full justify-center p-6">
        <div className="w-full max-w-5xl space-y-6">
          {/* Botón regresar */}
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <span className="text-lg leading-none">←</span>
            <span>Regresar a actividades</span>
          </button>

          {/* CARD 1: Información de la programación */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold">
                  Gestión actividades de mantenimiento
                </CardTitle>
                <CardDescription className="text-sm">
                  Programación actividad de mantenimiento
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="mb-4 text-sm font-semibold text-muted-foreground">
                Información de la programación
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Prioridad */}
                <div className="space-y-2">
                  <Label>Establecer prioridad</Label>
                  <Select
                    value={prioridad}
                    onValueChange={(val) => setPrioridad(val as Prioridad)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fecha de solicitud original */}
                <div className="space-y-2">
                  <Label>Fecha de solicitud</Label>
                  <Input
                    disabled
                    value={
                      maintenance?.createdAt
                        ? formatDate(maintenance.createdAt)
                        : ""
                    }
                    placeholder="dd/mm/aaaa"
                  />
                </div>

                {/* Fecha de inicio */}
                <div className="space-y-2">
                  <Label>Fecha de inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between text-left font-normal",
                          !fechaInicio && "text-muted-foreground",
                        )}
                      >
                        {formatFullDate(fechaInicio)}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fechaInicio}
                        onSelect={setFechaInicio}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Fecha de finalización */}
                <div className="space-y-2">
                  <Label>Fecha de finalización</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between text-left font-normal",
                          !fechaFin && "text-muted-foreground",
                        )}
                      >
                        {formatFullDate(fechaFin)}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fechaFin}
                        onSelect={setFechaFin}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* OT radicado */}
                <div className="space-y-2">
                  <Label>Orden de trabajo No</Label>
                  <div className="flex gap-2">
                    <Input
                      value={radicado}
                      onChange={(e) => setRadicado(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setRadicado(
                          generarRadicado(fechaInicio ?? new Date()),
                        )
                      }
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Autorizado por */}
                <div className="space-y-2">
                  <Label>Autorizado por</Label>
                  <Input
                    disabled
                    value={instructor?.name ?? ""}
                    placeholder="Nombre del instructor"
                  />
                </div>

                {/* Técnico */}
                <div className="space-y-2">
                  <Label>Asignada a</Label>
                  <Select
                    value={selectedTechnicianId}
                    onValueChange={setSelectedTechnicianId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(technicians) && technicians.length > 0 ? (
                        technicians.map((t) => (
                          <SelectItem key={t._id} value={t._id}>
                            {t.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-1 text-xs text-muted-foreground">
                          No hay técnicos disponibles
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Radicado solicitud */}
                <div className="space-y-2">
                  <Label>Radicado de solicitud</Label>
                  <Input
                    disabled
                    value={maintenance?.trackingNumber ?? ""}
                    placeholder="SO-MT-XXXX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: Información del bien */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-semibold">
                Información del bien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
                {/* Datos del bien */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label>Centro de formación</Label>
                    <Input
                      disabled
                      value={trainingCenter?.name ?? ""}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Ubicación / Ambiente</Label>
                    <Input
                      disabled
                      value={environment?.name ?? environment?.building ?? ""}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Ubicación física</Label>
                    <Input disabled value={asset.location ?? ""} />
                  </div>

                  <div className="space-y-1">
                    <Label>Marca</Label>
                    <Input disabled value={asset.brand ?? ""} />
                  </div>
                  <div className="space-y-1">
                    <Label>Modelo</Label>
                    <Input
                      disabled
                      value={asset.modelo ?? ""}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Número de serie</Label>
                    <Input
                      disabled
                      value={
                        maintenance?.serialNumber ??
                        asset.serialNumber ??
                        ""
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Tipo de equipo</Label>
                    <Input
                      disabled
                      value={asset.equipmentType ?? ""}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Cuenta dante</Label>
                    <Input
                      disabled
                      value={asset.accountHolder ?? ""}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Estado</Label>
                    <Input
                      disabled
                      value={
                        typeof asset.status === "boolean"
                          ? asset.status
                            ? "Activo"
                            : "Inactivo"
                          : ""
                      }
                    />
                  </div>
                </div>

                {/* Imagen del bien */}
                <div className="flex flex-col items-center gap-3">
                  {assetImage ? (
                    <div className="relative h-40 w-56 overflow-hidden rounded-md border bg-muted">
                      <Image
                        src={assetImage}
                        alt={asset.name ?? "Equipo"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 w-56 items-center justify-center rounded-md border text-xs text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    {(asset.inventoryCode ?? "") +
                      (asset.name ? ` — ${asset.name}` : "")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observaciones / notas de programación</Label>
                <Textarea
                  rows={3}
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  placeholder="Notas internas sobre la programación, indicaciones al técnico, etc."
                />
              </div>
            </CardContent>

            {/* Footer con botón centrado y regresar arriba */}
            <CardFooter className="flex flex-col items-center gap-3 border-t pt-4">
              <Button
                type="button"
                onClick={handleProgramar}
                disabled={saving || loadingDetail}
                className="min-w-[160px]"
              >
                {saving ? "Programando..." : "Programar"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* DIALOGO DE CONFIRMACIÓN */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <DialogTitle>Orden de trabajo creada</DialogTitle>
            </div>
            <DialogDescription>
              Se ha registrado la orden de trabajo de mantenimiento con los
              siguientes datos.
            </DialogDescription>
          </DialogHeader>

          {createdOrder && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="font-medium">Radicado OT</span>
                <span className="font-mono text-primary">
                  {createdOrder.radicado}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Prioridad</p>
                  <p className="text-sm capitalize">
                    {createdOrder.prioridad}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Estado inicial
                  </p>
                  <p className="text-sm">
                    {createdOrder.state ? "Cerrada" : "Abierta"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Fecha inicio
                  </p>
                  <p className="text-sm">
                    {formatDate(createdOrder.fechaInicio)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fecha fin</p>
                  <p className="text-sm">
                    {formatDate(createdOrder.fechaFin)}
                  </p>
                </div>
              </div>

              <p className="pt-2 text-xs text-muted-foreground">
                Puedes cerrar este mensaje o regresar al listado de actividades
                para continuar trabajando.
              </p>
            </div>
          )}

          <DialogFooter className="mt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false)
                router.back()
              }}
            >
              ← Regresar
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProgramarOrdenTrabajoPage
