"use client"

import * as React from "react"
import Image from "next/image"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Dialog para el resumen de la solicitud
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// APIs SIN TOKEN PARA ASSETS
import {
  Asset,
  obtenerActivos,
  obtenerActivoPorCodigoInventario,
} from "@/lib/api/assets-api"

// API CON TOKEN PARA MANTENIMIENTO
import {
  crearSolicitudMantenimiento,
  type CreateMaintenancePayload,
} from "@/lib/api/maintenance-service"

// API DE USUARIOS
import { getUserById, type User } from "@/lib/api/users-service"

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

type LastRequestInfo = {
  trackingNumber?: string
  requesterName: string
  requesterPhone: string
  serialNumber: string
  inventoryCode: string
  maintenanceType: string
  createdAt: string
}

const PlanearMantenimientosPage: React.FC = () => {
  const [fechaSolicitud, setFechaSolicitud] = React.useState<Date | undefined>(
    new Date()
  )
  const [codigoInventario, setCodigoInventario] = React.useState<string>("")
  const [openInventario, setOpenInventario] = React.useState(false)

  const [solicitadoPor, setSolicitadoPor] = React.useState<string>("")
  const [telefono, setTelefono] = React.useState<string>("")
  const [tipoMantenimiento, setTipoMantenimiento] = React.useState<string>("")
  const [descripcionSolicitud, setDescripcionSolicitud] =
    React.useState<string>("")

  // token SOLO para crear mantenimiento
  const [token, setToken] = React.useState<string>("")

  const [assets, setAssets] = React.useState<Asset[]>([])
  const [loadingAssets, setLoadingAssets] = React.useState(false)

  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null)
  const [loadingAssetDetail, setLoadingAssetDetail] = React.useState(false)
  const [sendingRequest, setSendingRequest] = React.useState(false)

  // Dialog de confirmación
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [lastRequestInfo, setLastRequestInfo] =
    React.useState<LastRequestInfo | null>(null)

  // Cargar token, usuario y lista de assets
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const storedToken =
      window.localStorage.getItem("auth_token") ||
      window.localStorage.getItem("token") ||
      ""

    if (storedToken) {
      setToken(storedToken)
      console.log("Token cargado:", storedToken)
    } else {
      console.warn("No se encontró token en localStorage")
    }

    // 1) Decodificar token para sacar el ID de usuario (sub)
    let userId: string | null = null
    if (storedToken) {
      const decoded = decodeJwt(storedToken)
      userId = decoded?.sub || decoded?._id || null
      console.log("Payload token:", decoded)
      console.log("UserId desde token:", userId)
    }

    // 2) Cargar datos del usuario (nombre, teléfono)
    const loadUser = async () => {
      if (!storedToken || !userId) return
      try {
        const user: User = await getUserById(userId, storedToken)
        console.log("Usuario cargado:", user)
        setSolicitadoPor(user.name || "")
        setTelefono(user.phone || "")
      } catch (error: any) {
        console.error("Error al cargar usuario:", error)
        toast("No se pudo cargar la información del usuario", {
          description: error?.message || "Verifica tu sesión.",
        })
      }
    }

    // 3) Cargar assets (SIN token)
    const loadAssets = async () => {
      try {
        setLoadingAssets(true)
        const data = await obtenerActivos()
        setAssets(data)
      } catch (error: any) {
        console.error(error)
        toast("Error al cargar activos", {
          description:
            error?.message || "No fue posible obtener la lista de activos.",
        })
      } finally {
        setLoadingAssets(false)
      }
    }

    loadUser()
    loadAssets()
  }, [])

  // CONSULTAR: trae la info del bien por código de inventario (SIN TOKEN)
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!codigoInventario) {
      toast("Selecciona un código de inventario", {
        description: "Debes escoger un equipo antes de consultar.",
      })
      return
    }

    try {
      setLoadingAssetDetail(true)
      const asset = await obtenerActivoPorCodigoInventario(codigoInventario)
      setSelectedAsset(asset)
      toast("Información del bien cargada", {
        description: `${asset.inventoryCode} - ${asset.name}`,
      })
    } catch (error: any) {
      console.error(error)
      setSelectedAsset(null)
      toast("Error al obtener información del bien", {
        description: error?.message || "Revisa el código de inventario.",
      })
    } finally {
      setLoadingAssetDetail(false)
    }
  }

  // ENVIAR SOLICITUD DE MANTENIMIENTO (AQUÍ SÍ SE USA TOKEN)
  const handleEnviarSolicitud = async () => {
    if (!selectedAsset) {
      toast("Primero consulta el bien", {
        description: "Debes cargar la información del bien antes de enviar.",
      })
      return
    }

    if (!tipoMantenimiento) {
      toast("Selecciona el tipo de mantenimiento", {
        description: "El campo tipo de mantenimiento es obligatorio.",
      })
      return
    }

    if (!descripcionSolicitud.trim()) {
      toast("Describe la solicitud", {
        description: "Ingresa una descripción del problema o requerimiento.",
      })
      return
    }

    if (!token) {
      toast("No hay token de autenticación", {
        description: "Inicia sesión nuevamente para poder crear la solicitud.",
      })
      return
    }

    try {
      setSendingRequest(true)

      // Formatear la fecha como "YYYY-MM-DD"
      const createdAt =
        fechaSolicitud
          ? fechaSolicitud.toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)

      const mantenimientoFormateado =
        tipoMantenimiento.charAt(0).toUpperCase() +
        tipoMantenimiento.slice(1).toLowerCase()

      const payload: CreateMaintenancePayload = {
        requesterName: solicitadoPor || "Sin nombre",
        requesterPhone: telefono || "",
        serialNumber: selectedAsset.serialNumber,
        InventoryCode: selectedAsset.inventoryCode, // viene del Asset
        issueDescription: descripcionSolicitud,
        maintenanceType: mantenimientoFormateado,
        createdAt,
      }

      console.log("Payload mantenimiento:", payload)

      const result = await crearSolicitudMantenimiento(token, payload)

      // Guardamos info para el Dialog
      setLastRequestInfo({
        trackingNumber: result.trackingNumber,
        requesterName: payload.requesterName,
        requesterPhone: payload.requesterPhone,
        serialNumber: payload.serialNumber,
        inventoryCode: payload.InventoryCode,
        maintenanceType: payload.maintenanceType,
        createdAt: payload.createdAt,
      })
      setDialogOpen(true)

      // Toast rápido
      toast("MANTENIMIENTO CREADO", {
        description: `Número de radicado: ${
          result.trackingNumber ?? "generado automáticamente"
        }`,
      })

      // Limpiar campos para nueva consulta
      setCodigoInventario("")
      setSelectedAsset(null)
      setTipoMantenimiento("")
      setDescripcionSolicitud("")
      setFechaSolicitud(new Date())
    } catch (error: any) {
      console.error(error)
      toast("Error al guardar la solicitud", {
        description:
          error?.message || "Error al guardar la solicitud de mantenimiento.",
      })
    } finally {
      setSendingRequest(false)
    }
  }

  const formatFechaSolicitud = () => {
    if (!fechaSolicitud) return "dd/mm/aaaa"
    return fechaSolicitud.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDate = (iso?: string) => {
    if (!iso) return ""
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ""
    return d.toLocaleDateString("es-CO")
  }

  const formatCreatedAt = (iso: string) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <>
      <div className="flex w-full justify-center p-6">
        <div className="w-full max-w-5xl space-y-6">
          {/* CARD PRINCIPAL - MISMO ORDEN */}
          <Card className="w-full">
            <form onSubmit={onSubmit}>
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-2xl">
                  Gestión de actividades de mantenimiento
                </CardTitle>
                <CardDescription className="text-base">
                  Solicitud de mantenimiento
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="mb-4 text-sm font-medium text-muted-foreground">
                  Información de la planeación
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Solicitado por */}
                  <div className="space-y-2">
                    <Label htmlFor="solicitadoPor">Solicitado por</Label>
                    <Input
                      id="solicitadoPor"
                      placeholder="Héctor Fabián Cardoso Morales"
                      value={solicitadoPor}
                      onChange={(e) => setSolicitadoPor(e.target.value)}
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono de contacto</Label>
                    <Input
                      id="telefono"
                      placeholder="5732..."
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>

                  {/* Fecha de solicitud */}
                  <div className="space-y-2">
                    <Label htmlFor="fechaSolicitud">Fecha de solicitud</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="fechaSolicitud"
                          variant="outline"
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !fechaSolicitud && "text-muted-foreground"
                          )}
                        >
                          {formatFechaSolicitud()}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fechaSolicitud}
                          onSelect={setFechaSolicitud}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Tipo de mantenimiento */}
                  <div className="space-y-2">
                    <Label htmlFor="tipoMantenimiento">
                      Tipo de mantenimiento
                    </Label>
                    <Select
                      value={tipoMantenimiento}
                      onValueChange={setTipoMantenimiento}
                    >
                      <SelectTrigger id="tipoMantenimiento" className="w-full">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventivo">Preventivo</SelectItem>
                        <SelectItem value="correctivo">Correctivo</SelectItem>
                        <SelectItem value="predictivo">Predictivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Código inventario (combobox buscable) */}
                  <div className="space-y-2">
                    <Label>Código inventario</Label>
                    <Popover
                      open={openInventario}
                      onOpenChange={setOpenInventario}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          disabled={loadingAssets}
                        >
                          {codigoInventario
                            ? (() => {
                                const item = assets.find(
                                  (a) => a.inventoryCode === codigoInventario
                                )
                                return item
                                  ? `${item.inventoryCode} - ${item.name}`
                                  : codigoInventario
                              })()
                            : loadingAssets
                            ? "Cargando códigos de inventario..."
                            : "Buscar código de inventario..."}
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0">
                        <Command>
                          <CommandInput placeholder="Escribe para buscar..." />
                          <CommandList>
                            <CommandEmpty>Sin resultados.</CommandEmpty>
                            <CommandGroup>
                              {assets.map((asset) => (
                                <CommandItem
                                  key={asset._id}
                                  value={`${asset.inventoryCode} - ${asset.name}`}
                                  onSelect={() => {
                                    setCodigoInventario(asset.inventoryCode)
                                    setOpenInventario(false)
                                  }}
                                >
                                  {asset.inventoryCode} - {asset.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button type="submit" disabled={loadingAssetDetail}>
                  {loadingAssetDetail ? "Consultando..." : "Consultar"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* INFORMACIÓN DEL BIEN */}
          {selectedAsset && (
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle>Información del bien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Layout: datos a la izquierda, imagen a la derecha */}
                <div className="grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
                  {/* Datos del bien */}
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label>Ambiente</Label>
                      <Input
                        disabled
                        value={selectedAsset.environmentId?.name ?? ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Ubicación</Label>
                      <Input disabled value={selectedAsset.location ?? ""} />
                    </div>
                    <div className="space-y-1">
                      <Label>Fecha de adquisición</Label>
                      <Input
                        disabled
                        value={formatDate(selectedAsset.acquisitionDate)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Marca</Label>
                      <Input disabled value={selectedAsset.brand ?? ""} />
                    </div>
                    <div className="space-y-1">
                      <Label>Modelo</Label>
                      <Input disabled value={selectedAsset.modelo ?? ""} />
                    </div>
                    <div className="space-y-1">
                      <Label>Número de serie</Label>
                      <Input
                        disabled
                        value={selectedAsset.serialNumber ?? ""}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Tipo de equipo</Label>
                      <Input
                        disabled
                        value={selectedAsset.equipmentType ?? ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Cuenta dante</Label>
                      <Input
                        disabled
                        value={selectedAsset.accountHolder ?? ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Estado</Label>
                      <Input
                        disabled
                        value={selectedAsset.status ? "Activo" : "Inactivo"}
                      />
                    </div>
                  </div>

                  {/* Imagen del equipo */}
                  <div className="flex flex-col items-center gap-3">
                    {selectedAsset.image ? (
                      <div className="relative h-40 w-56 overflow-hidden rounded-md border bg-muted">
                        <Image
                          src={selectedAsset.image}
                          alt={selectedAsset.name}
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
                      {selectedAsset.inventoryCode} — {selectedAsset.name}
                    </p>
                  </div>
                </div>

                {/* Descripción de la solicitud */}
                <div className="space-y-2">
                  <Label>Descripción de la solicitud</Label>
                  <Textarea
                    placeholder="Describe el problema, falla o requerimiento..."
                    value={descripcionSolicitud}
                    onChange={(e) => setDescripcionSolicitud(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button
                  type="button"
                  onClick={handleEnviarSolicitud}
                  disabled={sendingRequest}
                >
                  {sendingRequest ? "Enviando..." : "Enviar solicitud"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* DIALOGO DE CONFIRMACIÓN */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <DialogTitle>Solicitud creada correctamente</DialogTitle>
            </div>
            <DialogDescription>
              Se ha registrado la solicitud de mantenimiento con el siguiente
              radicado y datos asociados.
            </DialogDescription>
          </DialogHeader>

          {lastRequestInfo && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="font-medium">Radicado</span>
                <span className="font-mono text-primary">
                  {lastRequestInfo.trackingNumber ??
                    "Se generará automáticamente"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Solicitado por</p>
                  <p className="text-sm font-medium">
                    {lastRequestInfo.requesterName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="text-sm">{lastRequestInfo.requesterPhone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Código inventario
                  </p>
                  <p className="text-sm font-mono">
                    {lastRequestInfo.inventoryCode}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Número de serie
                  </p>
                  <p className="text-sm font-mono">
                    {lastRequestInfo.serialNumber}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Tipo de mantenimiento
                  </p>
                  <p className="text-sm">
                    {lastRequestInfo.maintenanceType}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Fecha de solicitud
                  </p>
                  <p className="text-sm">
                    {formatCreatedAt(lastRequestInfo.createdAt)}
                  </p>
                </div>
              </div>

              <p className="pt-2 text-xs text-muted-foreground">
                También se ha mostrado un aviso en pantalla. Puedes cerrar este
                mensaje para registrar otra solicitud.
              </p>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PlanearMantenimientosPage
