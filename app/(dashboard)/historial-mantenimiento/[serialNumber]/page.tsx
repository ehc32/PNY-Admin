"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wrench, Calendar, Clock, DollarSign, FileText, Download, Edit, Search, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { obtenerHistorialCompleto, type MaintenanceHistory } from "@/lib/api/maintenance-history-service"
import { toast } from "sonner"

export default function HistorialCompletoPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const [historial, setHistorial] = useState<MaintenanceHistory[]>([])
  const [loading, setLoading] = useState(true)
  const serialNumber = params.serialNumber as string

  useEffect(() => {
    if (token && serialNumber) {
      cargarHistorialCompleto()
    }
  }, [token, serialNumber])

  const cargarHistorialCompleto = async () => {
    setLoading(true)
    try {
      const data = await obtenerHistorialCompleto(token!, serialNumber)
      setHistorial(data)
    } catch (error) {
      console.error("Error al cargar historial:", error)
      toast.error("Error al cargar el historial de mantenimientos")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      return "N/A"
    }
  }

  const getMaintenanceTypeBadge = (type: string) => {
    const colors = {
      "Preventivo": "bg-blue-500 hover:bg-blue-600",
      "Correctivo": "bg-orange-500 hover:bg-orange-600",
      "Predictivo": "bg-purple-500 hover:bg-purple-600",
      "Emergencia": "bg-red-500 hover:bg-red-600"
    }
    
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-500 hover:bg-gray-600"}>
        {type}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Historial Completo de Mantenimientos</h1>
                <p className="text-muted-foreground">Número de Serie: <span className="font-mono font-semibold">{serialNumber}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Historial de Mantenimientos
                </CardTitle>
                <CardDescription>
                  Registro completo de todos los mantenimientos realizados ({historial.length} registros)
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando historial...</p>
              </div>
            ) : historial.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No hay historial registrado</h3>
                <p className="text-muted-foreground">
                  Este equipo no tiene mantenimientos registrados en el sistema.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Tipo de mantenimiento</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Orden de trabajo</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Informe mantenimiento</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Horas</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Costo</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Descripción</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item, index) => (
                      <tr 
                        key={item._id} 
                        className={`border-b border-border hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="py-4 px-4">
                          {getMaintenanceTypeBadge(item.maintenanceType)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm bg-secondary px-2 py-1 rounded">
                            {item.workOrder}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm bg-accent px-2 py-1 rounded">
                            {item.maintenanceReport}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {item.hours} Horas
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-sm font-semibold">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            {formatCurrency(item.cost)}
                          </div>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <p className="text-sm text-muted-foreground truncate" title={item.description}>
                            {item.description}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                              <Search className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas del historial */}
        {historial.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Wrench className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Mantenimientos</p>
                    <p className="text-2xl font-bold text-foreground">{historial.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Horas</p>
                    <p className="text-2xl font-bold text-foreground">
                      {historial.reduce((total, item) => total + item.hours, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Costo Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(historial.reduce((total, item) => total + item.cost, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Último Mantenimiento</p>
                    <p className="text-2xl font-bold text-foreground">
                      {historial.length > 0 ? formatDate(historial[0].createdAt) : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
