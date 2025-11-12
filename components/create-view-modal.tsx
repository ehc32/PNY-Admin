"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { crearVista, actualizarVista, type View, type Modulo, type CreateViewDto } from "@/lib/api/views-service"
import { toast } from "sonner"
import { Switch } from "./ui/switch"

interface CreateViewModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  modulos: Modulo[]
  editingView?: View | null
}

export function CreateViewModal({ isOpen, onClose, onSuccess, modulos, editingView }: CreateViewModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    route: "",
    moduloId: "",
    state: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingView) {
      setFormData({
        name: editingView.name,
        description: editingView.description,
        route: editingView.route,
        moduloId: editingView.moduloId,
        state: editingView.state ?? true,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        route: "",
        moduloId: "",
        state: true,
      })
    }
    setErrors({})
  }, [editingView, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria"
    }

    if (!formData.route.trim()) {
      newErrors.route = "La ruta es obligatoria"
    } else if (!formData.route.startsWith("/")) {
      newErrors.route = "La ruta debe comenzar con /"
    }

    if (!formData.moduloId) {
      newErrors.moduloId = "El módulo es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!token) {
      toast.error("No hay sesión activa")
      return
    }

    setLoading(true)
    try {
      const viewData: CreateViewDto = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        route: formData.route.trim(),
        moduloId: formData.moduloId,
        state: formData.state,
      }

      if (editingView) {
        await actualizarVista(token, editingView._id, viewData)
        toast.success("Vista actualizada correctamente")
      } else {
        await crearVista(token, viewData)
        toast.success("Vista creada correctamente")
      }

      onSuccess()
    } catch (error) {
      console.error("Error al guardar vista:", error)
      const message = error instanceof Error ? error.message : "Error al guardar la vista"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      route: "",
      moduloId: "",
      state: true,
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingView ? "Editar Vista" : "Nueva Vista"}
          </DialogTitle>
          <DialogDescription>
            {editingView 
              ? "Modifica los datos de la vista seleccionada"
              : "Completa los datos para crear una nueva vista en el sistema"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Gestión de Usuarios"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe la funcionalidad de esta vista"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="route">Ruta *</Label>
            <Input
              id="route"
              value={formData.route}
              onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
              placeholder="/usuarios/gestion"
            />
            {errors.route && (
              <p className="text-sm text-destructive">{errors.route}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="moduloId">Módulo *</Label>
            <Select
              value={formData.moduloId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, moduloId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un módulo" />
              </SelectTrigger>
              <SelectContent>
                {modulos.map((modulo) => (
                  <SelectItem key={modulo._id} value={modulo._id}>
                    {modulo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.moduloId && (
              <p className="text-sm text-destructive">{errors.moduloId}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="state"
              checked={formData.state}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, state: checked }))}
            />
            <Label htmlFor="state">Vista activa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : editingView ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
