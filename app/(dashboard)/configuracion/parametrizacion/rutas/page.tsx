"use client"

import { useState, useEffect } from "react"
import { MapPin, ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { obtenerModulos, eliminarModulo, cambiarEstadoModulo, type Modulo } from "@/lib/api/modulos-service"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"
import { CreateModuloModal } from "@/components/create-modulo-modal"

export default function ModulosPage() {
  const { token } = useAuth()
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingModulo, setEditingModulo] = useState<Modulo | null>(null)

  useEffect(() => {
    if (token) {
      cargarModulos()
    }
  }, [token])

  const cargarModulos = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const data = await obtenerModulos(token)
      setModulos(data)
    } catch (error) {
      console.error("Error al cargar módulos:", error)
      toast.error("Error al cargar los módulos")
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string) => {
    if (!token) return
    
    if (!confirm("¿Estás seguro de que deseas eliminar este módulo?")) return
    
    try {
      await eliminarModulo(token, id)
      toast.success("Módulo eliminado correctamente")
      cargarModulos()
    } catch (error) {
      console.error("Error al eliminar módulo:", error)
      toast.error("Error al eliminar el módulo")
    }
  }

  const handleCambiarEstado = async (id: string, nuevoEstado: boolean) => {
    if (!token) return
    
    try {
      await cambiarEstadoModulo(token, id, nuevoEstado)
      toast.success(`Módulo ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`)
      cargarModulos()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error("Error al cambiar el estado del módulo")
    }
  }

  const handleEdit = (modulo: Modulo) => {
    setEditingModulo(modulo)
    setIsCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditingModulo(null)
  }

  const handleSuccess = () => {
    cargarModulos()
    handleCloseModal()
  }

  const columns = [
    {
      id: "name",
      label: "Nombre",
      accessor: "name" as keyof Modulo,
      sortable: true,
      render: (value: any, modulo: Modulo) => (
        <div>
          <div className="font-medium">{modulo.name}</div>
          {modulo.description && (
            <div className="text-sm text-muted-foreground">{modulo.description}</div>
          )}
        </div>
      )
    },
    {
      id: "state",
      label: "Estado",
      accessor: "state" as keyof Modulo,
      render: (value: any, modulo: Modulo) => (
        <Badge variant={modulo.state ? "default" : "secondary"}>
          {modulo.state ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      id: "createdAt",
      label: "Fecha de Creación",
      accessor: "createdAt" as keyof Modulo,
      render: (value: any, modulo: Modulo) => (
        modulo.createdAt ? new Date(modulo.createdAt).toLocaleDateString("es-ES") : "N/A"
      )
    },
    {
      id: "actions",
      label: "Acciones",
      accessor: "_id" as keyof Modulo,
      render: (value: any, modulo: Modulo) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCambiarEstado(modulo._id, !modulo.state)}
            title={modulo.state ? "Desactivar" : "Activar"}
          >
            {modulo.state ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(modulo)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminar(modulo._id)}
            className="text-destructive hover:text-destructive"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/configuracion">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Gestión de Módulos</h1>
              <p className="text-muted-foreground">Administra los módulos del sistema</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Módulo
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Módulos del Sistema</CardTitle>
          <CardDescription>
            Lista de todos los módulos disponibles en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={modulos}
            columns={columns}
            isLoading={loading}
            showActions={false}
          />
        </CardContent>
      </Card>

      {/* Modal para crear/editar módulo */}
      <CreateModuloModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editingModulo={editingModulo}
      />
    </div>
  )
}
