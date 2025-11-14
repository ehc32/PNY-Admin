"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { crearRol, actualizarRol, type Role, type CreateRoleDto } from "@/lib/api/roles-service"
import { toast } from "sonner"

interface CreateRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingRole?: Role | null
}

export function CreateRoleModal({ isOpen, onClose, onSuccess, editingRole }: CreateRoleModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateRoleDto>({
    name: "",
    description: "",
    state: true,
  })

  useEffect(() => {
    if (editingRole) {
      setFormData({
        name: editingRole.name,
        description: editingRole.description || "",
        state: editingRole.state ?? true,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        state: true,
      })
    }
  }, [editingRole, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    try {
      if (editingRole) {
        await actualizarRol(token, editingRole._id, formData)
        toast.success("Rol actualizado correctamente")
      } else {
        await crearRol(token, formData)
        toast.success("Rol creado correctamente")
      }
      onSuccess()
    } catch (error) {
      console.error("Error al guardar rol:", error)
      toast.error(error instanceof Error ? error.message : "Error al guardar el rol")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateRoleDto, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingRole ? "Editar Rol" : "Crear Nuevo Rol"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Rol *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ej: Administrador, Usuario, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción del rol y sus responsabilidades"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="state"
              checked={formData.state}
              onCheckedChange={(checked) => handleInputChange("state", checked)}
            />
            <Label htmlFor="state">Rol activo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : editingRole ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
