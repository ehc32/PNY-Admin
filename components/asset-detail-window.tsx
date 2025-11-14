"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ArrowLeft, Package, MapPin, Calendar, User, Building, Truck, Edit, Trash2, Power, Wrench, Clock, DollarSign, FileText, ExternalLink, Eye, EyeOff, Hash, Barcode, Phone } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { type Asset } from "@/lib/api/assets-service"
import { useAuth } from "@/lib/auth-context"
import { obtenerHistorialPorSerie, type MaintenanceHistory } from "@/lib/api/maintenance-history-service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"

interface AssetDetailWindowProps {
  isOpen: boolean
  onClose: () => void
  asset: Asset | null
  onEdit?: (asset: Asset) => void
  onDelete?: (asset: Asset) => void
  onToggleStatus?: (asset: Asset) => void
}

export function AssetDetailWindow({ 
  isOpen, 
  onClose, 
  asset, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: AssetDetailWindowProps) {
  const { token } = useAuth()
  const router = useRouter()
  const [historialMantenimiento, setHistorialMantenimiento] = useState<MaintenanceHistory[]>([])
  const [loadingHistorial, setLoadingHistorial] = useState(false)

  const cargarHistorialMantenimiento = useCallback(async () => {
    if (!asset?.serialNumber || !token) return
    
    setLoadingHistorial(true)
    try {
      const response = await obtenerHistorialPorSerie(token, asset.serialNumber, 5, 1)
      setHistorialMantenimiento(response.data)
    } catch (error) {
      console.error("Error al cargar historial:", error)
      // No mostrar error toast para no molestar al usuario
    } finally {
      setLoadingHistorial(false)
    }
  }, [asset?.serialNumber, token])

  // Cargar historial de mantenimientos cuando se abre la ventana
  useEffect(() => {
    if (isOpen && asset && token) {
      cargarHistorialMantenimiento()
    }
  }, [isOpen, asset, token, cargarHistorialMantenimiento])

  if (!isOpen || !asset) return null

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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
    <div className="fixed inset-0 z-50 bg-background animate-in fade-in-0 duration-300 flex flex-col">
      {/* Header de la ventana */}
      <div className="sticky top-0 z-10 bg-background border-b flex-shrink-0">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{asset.name}</h1>
                <p className="text-muted-foreground">Detalles completos del bien</p>
              </div>
            </div>
          </div>
          
          {/* Acciones */}
          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <Button 
                variant="outline" 
                onClick={() => onToggleStatus(asset)}
                className="gap-2"
              >
                {asset.status ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {asset.status ? "Desactivar" : "Activar"}
              </Button>
            )}
            {onEdit && (
              <Button 
                variant="outline" 
                onClick={() => onEdit(asset)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                onClick={() => onDelete(asset)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal - Scrolleable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-500 delay-150">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            {/* Columna izquierda - Imagen y estado */}
            <div className="xl:col-span-1 space-y-6">
              {/* Imagen del bien */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Imagen del Bien</CardTitle>
                </CardHeader>
                <CardContent>
                  {asset.image ? (
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                      <Image
                        src={asset.image}
                        alt={asset.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square w-full flex items-center justify-center bg-muted rounded-lg border">
                      <Package className="h-20 w-20 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Estado y códigos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estado y Códigos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estado</label>
                    <div className="mt-1">
                      <Badge variant={asset.status ? "default" : "secondary"} className="text-sm px-3 py-1">
                        {asset.status ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-muted-foreground">Número de Serie</label>
                        <p className="font-mono text-sm bg-muted px-3 py-2 rounded mt-1">{asset.serialNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Barcode className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-muted-foreground">Código de Inventario</label>
                        <p className="font-mono text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded mt-1">{asset.inventoryCode}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Columna central - Información principal */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Información Básica</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nombre del Bien</label>
                        <p className="text-lg font-semibold mt-1">{asset.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tipo de Equipo</label>
                        <p className="font-medium mt-1">{asset.equipmentType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                          <p className="font-medium mt-1">{asset.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Marca</label>
                        <p className="font-medium mt-1">{asset.brand}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                        <p className="font-medium mt-1">{asset.modelo}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Responsable</label>
                          <p className="font-medium mt-1">{asset.accountHolder}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información administrativa */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Información Administrativa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Fecha de Adquisición</label>
                        <p className="font-medium text-lg mt-1">{formatDate(asset.acquisitionDate)}</p>
                      </div>
                    </div>

                    {/* Categoría y Ambiente */}
                    <div className="space-y-4">
                      {asset.categoryId && typeof asset.categoryId === 'object' && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                          <p className="font-medium mt-1">{asset.categoryId.name}</p>
                          {asset.categoryId.operationVars && asset.categoryId.operationVars.length > 0 && (
                            <div className="mt-2">
                              <label className="text-xs font-medium text-muted-foreground">Variables de Operación</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {asset.categoryId.operationVars.map((variable: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {variable}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {asset.environmentId && typeof asset.environmentId === 'object' && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Ambiente</label>
                          <p className="font-medium mt-1">{asset.environmentId.name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accesorios si existen */}
                  {asset.categoryId && typeof asset.categoryId === 'object' && asset.categoryId.accessories && asset.categoryId.accessories.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Accesorios Incluidos</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {asset.categoryId.accessories.map((accessory: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-sm">
                              {accessory}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha - Fabricante, Proveedor y Auditoría */}
            <div className="xl:col-span-1 space-y-6">
              
              {/* Información del fabricante */}
              {asset.manufacturer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Fabricante
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                      <p className="font-medium mt-1">{asset.manufacturer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                      <p className="text-sm mt-1">{asset.manufacturer.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                        <p className="text-sm mt-1">{asset.manufacturer.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Información del proveedor */}
              {asset.supplier && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Proveedor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                      <p className="font-medium mt-1">{asset.supplier.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                      <p className="text-sm mt-1">{asset.supplier.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                        <p className="text-sm mt-1">{asset.supplier.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Información de auditoría */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Auditoría</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                    <p className="text-sm mt-1">{formatDate(asset.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                    <p className="text-sm mt-1">{formatDate(asset.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sección de Historial de Mantenimientos */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-green-600" />
                    Historial de mantenimientos
                  </CardTitle>
                  {historialMantenimiento.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/historial-mantenimiento/${asset.serialNumber}`)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver historial completo
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loadingHistorial ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Cargando historial...</p>
                  </div>
                ) : historialMantenimiento.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
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
                          <th className="text-left py-3 px-2 font-semibold text-foreground text-sm">Tipo de mantenimiento</th>
                          <th className="text-left py-3 px-2 font-semibold text-foreground text-sm">Orden de trabajo</th>
                          <th className="text-left py-3 px-2 font-semibold text-foreground text-sm">Informe mantenimiento</th>
                          <th className="text-left py-3 px-2 font-semibold text-foreground text-sm">Horas</th>
                          <th className="text-left py-3 px-2 font-semibold text-foreground text-sm">Costo</th>
                          <th className="text-left py-3 px-2 font-semibold text-foreground text-sm">Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historialMantenimiento.slice(0, 5).map((item, index) => (
                          <tr 
                            key={item._id} 
                            className={`border-b border-border hover:bg-muted/50 transition-colors ${
                              index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                            }`}
                          >
                            <td className="py-3 px-2">
                              {getMaintenanceTypeBadge(item.maintenanceType)}
                            </td>
                            <td className="py-3 px-2">
                              <span className="font-mono text-xs bg-secondary px-2 py-1 rounded">
                                {item.workOrder}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span className="font-mono text-xs bg-accent px-2 py-1 rounded">
                                {item.maintenanceReport}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {item.hours} Horas
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-1 text-sm font-semibold">
                                <DollarSign className="h-3 w-3 text-green-600" />
                                {formatCurrency(item.cost)}
                              </div>
                            </td>
                            <td className="py-3 px-2 max-w-xs">
                              <p className="text-sm text-muted-foreground truncate" title={item.description}>
                                {item.description}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
