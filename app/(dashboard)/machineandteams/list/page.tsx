"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Tag, Wrench, Cpu, Settings2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { crearCategoria, type CreateCategoryDto } from "@/lib/api/categories-service"
import { toast } from "sonner"

export default function AgregarCategoriaPage() {
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
      await crearCategoria(token, formData)
      toast.success("Categoría creada correctamente")
      
      // Limpiar formulario
      setFormData({
        name: "",
        operationVars: [],
        accessories: [],
        specs: [],
        state: true
      })
    } catch (error) {
      console.error("Error al crear categoría:", error)
      const message = error instanceof Error ? error.message : "Error al crear la categoría"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/machineandteams/add">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Plus className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Agregar Nueva Categoría</h1>
              <p className="text-muted-foreground">Crea una nueva categoría para equipos y máquinas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Categoría</CardTitle>
          <CardDescription>
            Completa todos los campos para crear una nueva categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Button type="button" onClick={addOperationVar} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.operationVars.map((variable, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => removeOperationVar(index)}>
                    <Cpu className="h-3 w-3 mr-1" />
                    {variable} ×
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
                <Button type="button" onClick={addAccessory} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.accessories.map((accessory, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => removeAccessory(index)}>
                    <Wrench className="h-3 w-3 mr-1" />
                    {accessory} ×
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
                <Button type="button" onClick={addSpec} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specs.map((spec, index) => (
                  <Badge key={index} variant="default" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => removeSpec(index)}>
                    <Tag className="h-3 w-3 mr-1" />
                    {spec} ×
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
            <div className="flex justify-end gap-3 pt-6">
              <Link href="/machineandteams/add">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Categoría
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
