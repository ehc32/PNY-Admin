"use client"

import { Eye, Tag, Wrench, Cpu, Info } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type Category } from "@/lib/api/categories-service"

interface ViewCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category | null
}

export function ViewCategoryModal({ isOpen, onClose, category }: ViewCategoryModalProps) {
  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Detalles de la Categoría
          </DialogTitle>
          <DialogDescription>
            Información completa de la categoría &quot;{category.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="text-lg font-semibold">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">
                    <Badge variant={category.state ? "default" : "secondary"}>
                      {category.state ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                  <p className="text-sm">{new Date(category.createdAt).toLocaleString("es-ES")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                  <p className="text-sm">{new Date(category.updatedAt).toLocaleString("es-ES")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variables de Operación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="h-5 w-5" />
                Variables de Operación
                <Badge variant="outline">{category.operationVars.length}</Badge>
              </CardTitle>
              <CardDescription>
                Variables necesarias para el funcionamiento de los equipos de esta categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.operationVars.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {category.operationVars.map((variable, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      <Cpu className="h-3 w-3 mr-1" />
                      {variable}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No hay variables de operación definidas</p>
              )}
            </CardContent>
          </Card>

          {/* Accesorios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wrench className="h-5 w-5" />
                Accesorios
                <Badge variant="outline">{category.accessories.length}</Badge>
              </CardTitle>
              <CardDescription>
                Accesorios compatibles o requeridos para los equipos de esta categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.accessories.length > 0 ? (
                <div className="space-y-2">
                  {category.accessories.map((accessory, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{accessory}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No hay accesorios definidos</p>
              )}
            </CardContent>
          </Card>

          {/* Especificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tag className="h-5 w-5" />
                Especificaciones Técnicas
                <Badge variant="outline">{category.specs.length}</Badge>
              </CardTitle>
              <CardDescription>
                Especificaciones técnicas típicas de los equipos en esta categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.specs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {category.specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No hay especificaciones definidas</p>
              )}
            </CardContent>
          </Card>

          {/* Resumen */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">{category.operationVars.length}</p>
                  <p className="text-sm text-muted-foreground">Variables</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-secondary-foreground">{category.accessories.length}</p>
                  <p className="text-sm text-muted-foreground">Accesorios</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-accent-foreground">{category.specs.length}</p>
                  <p className="text-sm text-muted-foreground">Especificaciones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
