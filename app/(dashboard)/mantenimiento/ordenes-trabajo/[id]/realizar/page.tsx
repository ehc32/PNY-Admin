"use client"

import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { CalendarClock, ClipboardCheck, FileSignature } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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

// APIs que ya tienes o puedes agregar
import { getUserById, type User } from "@/lib/api/users-service"
import { getWorkOrderById, type WorkOrder } from "@/lib/api/work-orders-service"
import { createMaintenanceExecution, type CreateMaintenanceExecutionPayload } from "@/lib/api/maintenance-execution-service"

// --- helpers ---

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

// -- tipos locales mínimos para los datos anidados de la orden --
type WorkOrderSolicitudLite = {
    _id: string
    requesterName: string
    requesterPhone: string
    serialNumber: string
    maintenanceType: string
    issueDescription: string
    trackingNumber?: string
    assetInfo?: {
        name?: string
        location?: string
        brand?: string
        modelo?: string
        equipmentType?: string
        inventoryCode?: string
    }
}


export default function RealizarMantenimientoPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const { token } = useAuth()

    const [order, setOrder] = useState<WorkOrder | null>(null)
    const [instructor, setInstructor] = useState<User | null>(null)
    const [tecnico, setTecnico] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // campos del formulario
    const [typeMaintenance, setTypeMaintenance] = useState<"Preventivo" | "Correctivo" | "Otro" | "">("")
    const [description, setDescription] = useState("")
    const [observation, setObservation] = useState("")
    const [spareStatus, setSpareStatus] = useState<"Si" | "No" | "No aplica" | "">("")
    const [spareDetails, setSpareDetails] = useState("")
    const [executed, setExecuted] = useState(false)
    const [timeEstimate, setTimeEstimate] = useState<number | "">("")
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)

    // hora inicio / fin solo visual (no las estás enviando en el payload)
    const [horaInicio, setHoraInicio] = useState("")
    const [horaFin, setHoraFin] = useState("")

    // diálogo de confirmación
    const [dialogOpen, setDialogOpen] = useState(false)
    const [savedInfo, setSavedInfo] = useState<CreateMaintenanceExecutionPayload | null>(null)

    useEffect(() => {
        const loadData = async () => {
            if (!token || !params?.id) return
            setIsLoading(true)

            try {
                // 1) decodificar usuario
                const decoded = decodeJwt(token)
                const currentUserId: string | null = decoded?.sub || decoded?._id || null

                // 2) cargar orden de trabajo
                const workOrder = await getWorkOrderById(token, params.id)
                setOrder(workOrder)

                // 3) cargar técnico (el usuario autenticado)
                if (currentUserId) {
                    const user = await getUserById(currentUserId, token)
                    setTecnico(user)
                }

                // 4) cargar instructor de la orden (si viene el id en la orden)
                if (workOrder.instructorId) {
                    const inst = await getUserById(workOrder.instructorId, token)
                    setInstructor(inst)
                }

                // Prefill de algunos campos
                const solicitud = workOrder.solicitud as WorkOrderSolicitudLite
                setTypeMaintenance(
                    solicitud?.maintenanceType === "Correctivo" || solicitud?.maintenanceType === "Preventivo"
                        ? (solicitud.maintenanceType as "Correctivo" | "Preventivo")
                        : "Otro",
                )
                setDescription(solicitud?.issueDescription ?? "")
            } catch (error) {
                console.error(error)
                toast.error("No se pudo cargar la información de la orden")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [params?.id, token])

    // subir firma del técnico (imagen → base64)
    const handleSignatureChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const result = reader.result?.toString() || null
            setSignatureDataUrl(result)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!token || !order || !tecnico) {
            toast.error("Falta información para registrar el mantenimiento")
            return
        }

        if (!typeMaintenance) {
            toast.error("Selecciona el tipo de mantenimiento")
            return
        }

        if (!description.trim()) {
            toast.error("Ingresa la descripción del trabajo realizado")
            return
        }

        if (!spareStatus) {
            toast.error("Indica si requirió repuestos")
            return
        }

        if (!signatureDataUrl) {
            toast.error("Carga la firma del técnico antes de guardar")
            return
        }

        try {
            setIsSaving(true)

            const payload: CreateMaintenanceExecutionPayload = {
                typeMaintenance,
                description,
                observation,
                sparePartsStatus: spareStatus,
                sparePartsDetails: spareDetails,
                state: executed,
                technicalId: tecnico._id!,
                technicalSignature: signatureDataUrl,
                timeEstimate: typeof timeEstimate === "number" ? timeEstimate : 0,
                wordOrdenId: order._id!,
            }

            await createMaintenanceExecution(token, payload)

            setSavedInfo(payload)
            setDialogOpen(true)
            toast.success("Mantenimiento registrado correctamente")

            // limpiar formulario
            setObservation("")
            setSpareDetails("")
            setSpareStatus("")
            setExecuted(false)
            setTimeEstimate("")
            setSignatureDataUrl(null)
            setHoraInicio("")
            setHoraFin("")
        } catch (error: any) {
            console.error(error)
            toast.error(
                error?.message || "No se pudo registrar el mantenimiento. Intenta nuevamente.",
            )
        } finally {
            setIsSaving(false)
        }
    }

    const solicitud = order?.solicitud as WorkOrderSolicitudLite | undefined
    const asset = solicitud?.assetInfo

    const handleCloseDialog = () => {
        setDialogOpen(false)
        // redirigir a listado de órdenes de trabajo
        router.push("/mantenimiento/ordenes-trabajo")
    }

    return (
        <div className="w-full flex justify-center p-6">
            <div className="w-full max-w-6xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Gestión de actividades de mantenimiento
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Formato de orden de trabajo e informe de mantenimiento.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/mantenimiento/ordenes-trabajo")}
                    >
                        ← Volver a órdenes
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* === ORDEN DE TRABAJO === */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Orden de Trabajo</CardTitle>
                                    <CardDescription>
                                        Datos generales de la orden y del equipo intervenido.
                                    </CardDescription>
                                </div>
                                <div className="flex flex-col items-end gap-1 text-sm">
                                    <span className="font-semibold">
                                        Orden de trabajo: {order?.radicado ?? "—"}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        Radicado solicitud: {solicitud?.trackingNumber ?? "—"}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-4 space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-1">
                                    <Label>Número de serie</Label>
                                    <Input value={solicitud?.serialNumber ?? ""} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Número de placa / inventario</Label>
                                    <Input value={asset?.inventoryCode ?? ""} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Fecha de inicio</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="date"
                                            value={order?.fechaInicio?.slice(0, 10) ?? ""}
                                            disabled
                                        />
                                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label>Nombre de contacto</Label>
                                    <Input value={solicitud?.requesterName ?? ""} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Teléfono</Label>
                                    <Input value={solicitud?.requesterPhone ?? ""} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Fecha fin (programada)</Label>
                                    <Input
                                        type="date"
                                        value={order?.fechaFin?.slice(0, 10) ?? ""}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label>Ubicación</Label>
                                    <Input value={asset?.location ?? ""} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Hora inicio</Label>
                                    <Input
                                        type="time"
                                        value={horaInicio}
                                        onChange={(e) => setHoraInicio(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Hora fin</Label>
                                    <Input
                                        type="time"
                                        value={horaFin}
                                        onChange={(e) => setHoraFin(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* info extra de activo */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-1">
                                    <Label>Equipo</Label>
                                    <Input value={asset?.name ?? ""} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Marca</Label>
                                    <Input value={asset?.brand ?? ""} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label>Modelo</Label>
                                    <Input value={asset?.modelo ?? ""} disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* === TRABAJO REALIZADO === */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle>Trabajo realizado</CardTitle>
                            <CardDescription>
                                Registra el tipo de mantenimiento, actividades, repuestos y estado de la orden.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-4 space-y-6">
                            {/* fila de tipo mantenimiento + repuestos */}
                            <div className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
                                <div className="space-y-3">
                                    <Label>Mantenimiento realizado</Label>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={typeMaintenance === "Preventivo"}
                                                onCheckedChange={() => setTypeMaintenance("Preventivo")}
                                            />
                                            <span>Preventivo</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={typeMaintenance === "Correctivo"}
                                                onCheckedChange={() => setTypeMaintenance("Correctivo")}
                                            />
                                            <span>Correctivo</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={typeMaintenance === "Otro"}
                                                onCheckedChange={() => setTypeMaintenance("Otro")}
                                            />
                                            <span>Otro</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Repuestos requeridos</Label>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={spareStatus === "Si"}
                                                onCheckedChange={() => setSpareStatus("Si")}
                                            />
                                            <span>Si</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={spareStatus === "No"}
                                                onCheckedChange={() => setSpareStatus("No")}
                                            />
                                            <span>No</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={spareStatus === "No aplica"}
                                                onCheckedChange={() => setSpareStatus("No aplica")}
                                            />
                                            <span>No aplica</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* descripción / repuestos detalle */}
                            <div className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
                                <div className="space-y-2">
                                    <Label>Descripción del trabajo y/o servicio solicitado</Label>
                                    <Textarea
                                        rows={5}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe el trabajo realizado, pruebas efectuadas, ajustes, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Detalle de repuestos</Label>
                                    <Textarea
                                        rows={5}
                                        value={spareDetails}
                                        onChange={(e) => setSpareDetails(e.target.value)}
                                        placeholder="Referencia, cantidad y observaciones de los repuestos utilizados."
                                    />
                                </div>
                            </div>

                            {/* observaciones */}
                            <div className="space-y-2">
                                <Label>Observaciones</Label>
                                <Textarea
                                    rows={4}
                                    value={observation}
                                    onChange={(e) => setObservation(e.target.value)}
                                    placeholder="Observaciones adicionales, recomendaciones al usuario, riesgos detectados, etc."
                                />
                            </div>

                            {/* estado + ejecutado por + firma */}
                            <div className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
                                <div className="space-y-3">
                                    <Label>Estado de la orden de trabajo</Label>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={executed}
                                                onCheckedChange={() => setExecuted(true)}
                                            />
                                            <span>Ejecutado</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <Checkbox
                                                checked={!executed}
                                                onCheckedChange={() => setExecuted(false)}
                                            />
                                            <span>Pendiente</span>
                                        </label>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <Label>Ejecutado por</Label>
                                            <Input value={tecnico?.name ?? ""} disabled />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Tiempo estimado / empleado (horas)</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                step={0.5}
                                                value={timeEstimate}
                                                onChange={(e) =>
                                                    setTimeEstimate(
                                                        e.target.value === "" ? "" : Number(e.target.value),
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Firma técnico</Label>
                                    <div className="border rounded-md p-3 flex flex-col items-center gap-3 bg-muted/40">
                                        <div className="h-24 w-full max-w-xs border rounded-md bg-background flex items-center justify-center overflow-hidden">
                                            {signatureDataUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={signatureDataUrl}
                                                    alt="Firma del técnico"
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                                                    <FileSignature className="h-5 w-5" />
                                                    <span>Sin firma cargada</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                                            <span>Puedes cargar una imagen escaneada de la firma del técnico.</span>
                                            <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleSignatureChange}
                                                />
                                                <Button type="button" size="sm" variant="outline">
                                                    Cargar firma
                                                </Button>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* botón principal centrado */}
                            <div className="flex justify-center pt-2">
                                <Button
                                    type="submit"
                                    className="min-w-[220px] gap-2"
                                    disabled={isSaving || isLoading}
                                >
                                    <ClipboardCheck className="h-4 w-4" />
                                    {isSaving ? "Guardando informe..." : "Registrar mantenimiento"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                {/* diálogo de confirmación */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Informe registrado correctamente</DialogTitle>
                            <DialogDescription>
                                Se ha guardado la información del mantenimiento asociado a la orden{" "}
                                <span className="font-semibold">{order?.radicado ?? "—"}</span>.
                            </DialogDescription>
                        </DialogHeader>

                        {savedInfo && (
                            <div className="space-y-3 text-sm mt-2">
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        Tipo de mantenimiento:{" "}
                                        <span className="font-medium">{savedInfo.typeMaintenance}</span>
                                    </span>
                                </div>
                                <p>
                                    <span className="font-medium">Repuestos:</span> {savedInfo.sparePartsStatus}
                                </p>
                                <p>
                                    <span className="font-medium">Estado de la orden:</span>{" "}
                                    {savedInfo.state ? "Ejecutada" : "Pendiente"}
                                </p>
                                <p>
                                    <span className="font-medium">Horas reportadas:</span>{" "}
                                    {savedInfo.timeEstimate}
                                </p>
                            </div>
                        )}

                        <DialogFooter className="mt-4">
                            <Button onClick={handleCloseDialog}>Ver órdenes de trabajo</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
