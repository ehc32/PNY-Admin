"use client"

import { useState, useEffect } from "react"
import { Plus, X, Tag, Wrench, Cpu } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { crearCategoria, actualizarCategoria, type Category, type CreateCategoryDto } from "@/lib/api/categories-service"
import { toast } from "sonner"

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingCategory?: Category | null
}

export function CreateCategoryModal({ isOpen, onClose, onSuccess, editingCategory }: CreateCategoryModalProps) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: "",
    operationVars: [],
    accessories: [],
    specs: [],
    state: true
  })

  // Estados para los inputs dinámicos
  const [newOperationVar, setNewOperationVar] = useState("")
  const [newAccessory, setNewAccessory] = useState("")
  const [newSpec, setNewSpec] = useState("")

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        operationVars: [...editingCategory.operationVars],
        accessories: [...editingCategory.accessories],
        specs: [...editingCategory.specs],
        state: editingCategory.state
      })
    } else {
      setFormData({
        name: "",
        operationVars: [],
        accessories: [],
        specs: [],
        state: true
      })
    }
  }, [editingCategory, isOpen])

  const handleChange = (field: keyof CreateCategoryDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addOperationVar = () => {
    if (newOperationVar.trim() && !formData.operationVars.includes(newOperationVar.trim())) {
      setFormData(prev => ({
        ...prev,
        operationVars: [...prev.operationVars, newOperationVar.trim()]
      }))
      setNewOperationVar("")
    }
  }

  const removeOperationVar = (index: number) => {
    setFormData(prev => ({
      ...prev,
      operationVars: prev.operationVars.filter((_, i) => i !== index)
    }))
  }

  const addAccessory = () => {
    if (newAccessory.trim() && !formData.accessories.includes(newAccessory.trim())) {
      setFormData(prev => ({
        ...prev,
        accessories: [...prev.accessories, newAccessory.trim()]
      }))
      setNewAccessory("")
    }
  }

  const removeAccessory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accessories: prev.accessories.filter((_, i) => i !== index)
    }))
  }

  const addSpec = () => {
    if (newSpec.trim() && !formData.specs.includes(newSpec.trim())) {
      setFormData(prev => ({
        ...prev,
        specs: [...prev.specs, newSpec.trim()]
      }))
      setNewSpec("")
    }
  }

  const removeSpec = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      toast.error("No tienes autorización")
      return
    }

    if (!formData.name.trim()) {
      toast.error("El nombre de la categoría es requerido")
      return
    }

    setLoading(true)
    try {
      if (editingCategory) {
        await actualizarCategoria(token, editingCategory._id, formData)
        toast.success("Categoría actualizada correctamente")
      } else {
        await crearCategoria(token, formData)
        toast.success("Categoría creada correctamente")
      }
      
      onSuccess()
    } catch (error) {
      console.error("Error al guardar categoría:", error)
      const message = error instanceof Error ? error.message : "Error al guardar la categoría"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
          <DialogDescription>
            {editingCategory ? "Modifica los datos de la categoría" : "Completa la información para crear una nueva categoría"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre de la Categoría <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej: Equipo de cómputo"
              required
            />
          </div>

          {/* Variables de Operación */}
          <div className="space-y-3">
            <Label>Variables de Operación</Label>
            <div className="flex gap-2">
              <Input
                value={newOperationVar}
                onChange={(e) => setNewOperationVar(e.target.value)}
                placeholder="Ej: electricidad, voltios"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOperationVar())}
              />
              <Button type="button" onClick={addOperationVar} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {formData.operationVars.map((variable, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => removeOperationVar(index)}>
                  <Cpu className="h-3 w-3 mr-1" />
                  {variable} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Accesorios */}
          <div className="space-y-3">
            <Label>Accesorios</Label>
            <div className="flex gap-2">
              <Input
                value={newAccessory}
                onChange={(e) => setNewAccessory(e.target.value)}
                placeholder="Ej: Teclado mecánico corsair"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAccessory())}
              />
              <Button type="button" onClick={addAccessory} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {formData.accessories.map((accessory, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => removeAccessory(index)}>
                  <Wrench className="h-3 w-3 mr-1" />
                  {accessory} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Especificaciones */}
          <div className="space-y-3">
            <Label>Especificaciones</Label>
            <div className="flex gap-2">
              <Input
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Ej: CoreI9, 32gb ram"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
              />
              <Button type="button" onClick={addSpec} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {formData.specs.map((spec, index) => (
                <Badge key={index} variant="default" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => removeSpec(index)}>
                  <Tag className="h-3 w-3 mr-1" />
                  {spec} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Select value={formData.state ? "true" : "false"} onValueChange={(value) => handleChange("state", value === "true")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  {editingCategory ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {editingCategory ? "Actualizar" : "Crear"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
