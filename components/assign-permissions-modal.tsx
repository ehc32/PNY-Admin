"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { obtenerRoles, asignarVistasARol, type Role } from "@/lib/api/roles-service"
import { type View } from "@/lib/api/views-service"
import { toast } from "sonner"

interface AssignPermissionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  selectedView: View | null
}

export function AssignPermissionsModal({ isOpen, onClose, onSuccess, selectedView }: AssignPermissionsModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  useEffect(() => {
    if (isOpen && token) {
      cargarRoles()
    }
  }, [isOpen, token])

  useEffect(() => {
    if (selectedView && roles.length > 0) {
      // Marcar roles que ya tienen esta vista asignada
      const rolesConVista = roles
        .filter(role => role.views.includes(selectedView._id))
        .map(role => role._id)
      setSelectedRoles(rolesConVista)
    }
  }, [selectedView, roles])

  const cargarRoles = async () => {
    if (!token) return
    
    try {
      const data = await obtenerRoles(token)
      setRoles(data)
    } catch (error) {
      console.error("Error al cargar roles:", error)
      toast.error("Error al cargar los roles")
    }
  }

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles(prev => [...prev, roleId])
    } else {
      setSelectedRoles(prev => prev.filter(id => id !== roleId))
    }
  }

  const handleSubmit = async () => {
    if (!token || !selectedView) {
      toast.error("No hay vista seleccionada")
      return
    }

    setLoading(true)
    try {
      // Asignar o quitar la vista de cada rol según la selección
      const promises = roles.map(async (role) => {
        const shouldHaveView = selectedRoles.includes(role._id)
        const currentlyHasView = role.views.includes(selectedView._id)

        if (shouldHaveView !== currentlyHasView) {
          let newViews: string[]
          
          if (shouldHaveView) {
            // Agregar vista al rol
            newViews = [...role.views, selectedView._id]
          } else {
            // Quitar vista del rol
            newViews = role.views.filter(viewId => viewId !== selectedView._id)
          }

          return asignarVistasARol(token, role._id, newViews)
        }
      })

      await Promise.all(promises.filter(Boolean))
      toast.success("Permisos actualizados correctamente")
      onSuccess()
    } catch (error) {
      console.error("Error al asignar permisos:", error)
      const message = error instanceof Error ? error.message : "Error al asignar permisos"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedRoles([])
    onClose()
  }

  if (!selectedView) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Asignar Vista a Roles</DialogTitle>
          <DialogDescription>
            Selecciona los roles que tendrán acceso a la vista &quot;{selectedView.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{selectedView.route}</Badge>
              <Badge variant="secondary">{selectedView.modulo?.name}</Badge>
            </div>
            <h4 className="font-medium">{selectedView.name}</h4>
            <p className="text-sm text-muted-foreground">{selectedView.description}</p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Roles disponibles:</Label>
            
            {roles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay roles disponibles</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {roles.map((role) => (
                  <div key={role._id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={role._id}
                      checked={selectedRoles.includes(role._id)}
                      onCheckedChange={(checked) => handleRoleToggle(role._id, !!checked)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={role._id} className="font-medium cursor-pointer">
                        {role.name}
                      </Label>
                      {role.description && (
                        <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={role.state ? "default" : "secondary"} className="text-xs">
                          {role.state ? "Activo" : "Inactivo"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {role.views.length} vista{role.views.length !== 1 ? 's' : ''} asignada{role.views.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || roles.length === 0}>
            {loading ? "Guardando..." : "Guardar Permisos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
