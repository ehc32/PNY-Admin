"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ArrowLeft, Search, FileText, Calendar, User, Phone, Hash, Wrench, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface PublicMaintenanceRequest {
  trackingNumber: string
  requesterName: string
  requesterPhone: string
  serialNumber: string
  issueDescription: string
  maintenanceType: string
  workOrderStatus: boolean
  createdAt: string
}

export default function ConsultarSolicitudPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [solicitud, setSolicitud] = useState<PublicMaintenanceRequest | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingNumber.trim()) {
      toast.error("Por favor ingrese un número de radicado")
      return
    }

    setLoading(true)

    try {
      // Simulación de búsqueda sin autenticación
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Datos simulados para demostración
      const mockSolicitud: PublicMaintenanceRequest = {
        trackingNumber: trackingNumber.trim(),
        requesterName: "Juan Pérez",
        requesterPhone: "573001234567",
        serialNumber: "ABC123456",
        issueDescription: "El equipo no enciende correctamente y presenta fallas intermitentes en la pantalla.",
        maintenanceType: "Correctivo",
        workOrderStatus: Math.random() > 0.5, // Aleatorio para demo
        createdAt: new Date().toISOString()
      }
      
      setSolicitud(mockSolicitud)
      toast.success("Solicitud encontrada")
    } catch (error) {
      console.error("Error al buscar solicitud:", error)
      toast.error("No se encontró ninguna solicitud con ese número de radicado")
      setSolicitud(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return "N/A"
    }
  }

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-500 hover:bg-green-600">
        Orden de Trabajo Creada
      </Badge>
    ) : (
      <Badge variant="secondary">
        Pendiente de Revisión
      </Badge>
    )
  }

  const getMaintenanceTypeBadge = (type: string) => {
    const colors = {
      "Preventivo": "bg-blue-500 hover:bg-blue-600",
      "Correctivo": "bg-orange-500 hover:bg-orange-600",
      "Desconocido": "bg-gray-500 hover:bg-gray-600"
    }
    
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-500 hover:bg-gray-600"}>
        {type}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/mantenimiento")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Consulta el Estado de tu Solicitud
            </h1>
            <p className="text-xl opacity-90">
              Ingresa tu número de radicado para conocer el estado de tu solicitud de mantenimiento
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Formulario de búsqueda */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
                <Search className="h-6 w-6" />
                Buscar Solicitud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber" className="text-sm font-bold text-gray-700">
                    Número de Radicado
                  </Label>
                  <Input
                    id="trackingNumber"
                    type="text"
                    placeholder="Ej: MNT-1699123456789"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar Solicitud
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Resultado de la búsqueda */}
        {solicitud && (
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <FileText className="h-8 w-8" />
                  Detalles de la Solicitud
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Información del solicitante */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                      Información del Solicitante
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-500" />
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Nombre</Label>
                          <p className="font-semibold">{solicitud.requesterName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Teléfono</Label>
                          <p className="font-semibold">{solicitud.requesterPhone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Fecha de Solicitud</Label>
                          <p className="font-semibold">{formatDate(solicitud.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del equipo */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                      Información del Equipo
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Hash className="h-5 w-5 text-gray-500" />
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Número de Serie</Label>
                          <p className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                            {solicitud.serialNumber}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Wrench className="h-5 w-5 text-gray-500" />
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Tipo de Mantenimiento</Label>
                          <div className="mt-1">
                            {getMaintenanceTypeBadge(solicitud.maintenanceType)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción del problema */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Descripción del Problema
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {solicitud.issueDescription || "No se proporcionó descripción"}
                    </p>
                  </div>
                </div>

                {/* Estado de la solicitud */}
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Estado de la Solicitud
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Número de Radicado: <span className="font-mono font-bold">{solicitud.trackingNumber}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(solicitud.workOrderStatus)}
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-white rounded border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600">
                      {solicitud.workOrderStatus 
                        ? "✅ Su solicitud ha sido procesada y se ha creado una orden de trabajo. El equipo técnico se pondrá en contacto con usted pronto."
                        : "⏳ Su solicitud está siendo revisada por nuestro equipo técnico. Le notificaremos cuando se genere la orden de trabajo."
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Información adicional */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ¿No tienes un número de radicado?
              </h3>
              <p className="text-green-700 mb-4">
                Si aún no has enviado tu solicitud de mantenimiento, puedes hacerlo desde la página principal.
              </p>
              <Button 
                onClick={() => router.push("/mantenimiento")}
                className="bg-green-600 hover:bg-green-700"
              >
                Crear Nueva Solicitud
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
