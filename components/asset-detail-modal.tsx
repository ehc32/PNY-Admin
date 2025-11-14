"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Asset } from "@/lib/api/assets-service"
import { Package, MapPin, Calendar, User, Building, Phone, Mail, Hash, Barcode } from "lucide-react"
import Image from "next/image"

interface AssetDetailModalProps {
  isOpen: boolean
  onClose: () => void
  asset: Asset | null
}

export function AssetDetailModal({ isOpen, onClose, asset }: AssetDetailModalProps) {
  if (!asset) return null

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalles del Bien: {asset.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Imagen del bien */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Imagen</CardTitle>
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
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                    <p className="text-lg font-semibold">{asset.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estado</label>
                    <div className="mt-1">
                      <Badge variant={asset.status ? "default" : "secondary"}>
                        {asset.status ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo de Equipo</label>
                    <p className="font-medium">{asset.equipmentType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                      <p className="font-medium">{asset.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Especificaciones técnicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Especificaciones Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Marca</label>
                    <p className="font-medium">{asset.brand}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                    <p className="font-medium">{asset.modelo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Número de Serie</label>
                      <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{asset.serialNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Barcode className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Código de Inventario</label>
                      <p className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">{asset.inventoryCode}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información administrativa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Administrativa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Responsable</label>
                      <p className="font-medium">{asset.accountHolder}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fecha de Adquisición</label>
                      <p className="font-medium">{formatDate(asset.acquisitionDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Categoría y Ambiente */}
                {(asset.categoryId || asset.environmentId) && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {asset.categoryId && typeof asset.categoryId === 'object' && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                          <p className="font-medium">{asset.categoryId.name}</p>
                          {asset.categoryId.operationVars && asset.categoryId.operationVars.length > 0 && (
                            <div className="mt-2">
                              <label className="text-xs font-medium text-muted-foreground">Variables de Operación</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {asset.categoryId.operationVars.map((variable, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {variable}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {asset.categoryId.accessories && asset.categoryId.accessories.length > 0 && (
                            <div className="mt-2">
                              <label className="text-xs font-medium text-muted-foreground">Accesorios</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {asset.categoryId.accessories.map((accessory, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {accessory}
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
                          <p className="font-medium">{asset.environmentId.name}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Información del fabricante */}
            {asset.manufacturer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Fabricante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                    <p className="font-medium">{asset.manufacturer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                    <p>{asset.manufacturer.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                      <p>{asset.manufacturer.phone}</p>
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
                <CardContent className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                    <p className="font-medium">{asset.supplier.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                    <p>{asset.supplier.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                      <p>{asset.supplier.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información de auditoría */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información de Auditoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                    <p className="text-sm">{formatDate(asset.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                    <p className="text-sm">{formatDate(asset.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
