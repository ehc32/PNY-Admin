"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "./ui/switch"
import { useAuth } from "@/lib/auth-context"
import { crearModulo, actualizarModulo, type Modulo, type CreateModuloDto } from "@/lib/api/modulos-service"
import { toast } from "sonner"

interface CreateModuloModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingModulo?: Modulo | null
}

export function CreateModuloModal({ isOpen, onClose, onSuccess, editingModulo }: CreateModuloModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    state: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingModulo) {
      setFormData({
        name: editingModulo.name,
        description: editingModulo.description || "",
        state: editingModulo.state ?? true,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        state: true,
      })
    }
    setErrors({})
  }, [editingModulo, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
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
      const moduloData: CreateModuloDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        state: formData.state,
      }

      if (editingModulo) {
        await actualizarModulo(token, editingModulo._id, moduloData)
        toast.success("Módulo actualizado correctamente")
      } else {
        await crearModulo(token, moduloData)
        toast.success("Módulo creado correctamente")
      }

      onSuccess()
    } catch (error) {
      console.error("Error al guardar módulo:", error)
      const message = error instanceof Error ? error.message : "Error al guardar el módulo"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
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
            {editingModulo ? "Editar Módulo" : "Nuevo Módulo"}
          </DialogTitle>
          <DialogDescription>
            {editingModulo 
              ? "Modifica los datos del módulo seleccionado"
              : "Completa los datos para crear un nuevo módulo en el sistema"
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
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe la funcionalidad de este módulo"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="state"
              checked={formData.state}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, state: checked }))}
            />
            <Label htmlFor="state">Módulo activo</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : editingModulo ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
