"use client"

import { useState, useEffect } from "react"
import { Shield, ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, UserCheck } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { obtenerVistas, obtenerModulos, eliminarVista, cambiarEstadoVista, type View, type Modulo } from "@/lib/api/views-service"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"
import { CreateViewModal } from "@/components/create-view-modal"
import { AssignPermissionsModal } from "@/components/assign-permissions-modal"

export default function VistasPage() {
  const { token } = useAuth()
  const [vistas, setVistas] = useState<View[]>([])
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingView, setEditingView] = useState<View | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedView, setSelectedView] = useState<View | null>(null)

  useEffect(() => {
    if (token) {
      cargarDatos()
    }
  }, [token])

  const cargarDatos = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const [vistasData, modulosData] = await Promise.all([
        obtenerVistas(token),
        obtenerModulos(token)
      ])
      
      // Mapear vistas con información del módulo
      const vistasConModulo = vistasData.map(vista => ({
        ...vista,
        modulo: modulosData.find(m => m._id === vista.moduloId)
      }))
      
      setVistas(vistasConModulo)
      setModulos(modulosData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast.error("Error al cargar las vistas")
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string) => {
    if (!token) return
    
    if (!confirm("¿Estás seguro de que deseas eliminar esta vista?")) return
    
    try {
      await eliminarVista(token, id)
      toast.success("Vista eliminada correctamente")
      cargarDatos()
    } catch (error) {
      console.error("Error al eliminar vista:", error)
      toast.error("Error al eliminar la vista")
    }
  }

  const handleCambiarEstado = async (id: string, nuevoEstado: boolean) => {
    if (!token) return
    
    try {
      await cambiarEstadoVista(token, id, nuevoEstado)
      toast.success(`Vista ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`)
      cargarDatos()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error("Error al cambiar el estado de la vista")
    }
  }

  const handleEdit = (vista: View) => {
    setEditingView(vista)
    setIsCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditingView(null)
  }

  const handleSuccess = () => {
    cargarDatos()
    handleCloseModal()
  }

  const handleAssignPermissions = (vista: View) => {
    setSelectedView(vista)
    setIsAssignModalOpen(true)
  }

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false)
    setSelectedView(null)
  }

  const handleAssignSuccess = () => {
    toast.success("Permisos asignados correctamente")
    handleCloseAssignModal()
  }

  const columns = [
    {
      id: "name",
      label: "Nombre",
      accessor: "name" as keyof View,
      sortable: true,
      render: (value: any, vista: View) => (
        <div>
          <div className="font-medium">{vista.name}</div>
          <div className="text-sm text-muted-foreground">{vista.description}</div>
        </div>
      )
    },
    {
      id: "route",
      label: "Ruta",
      accessor: "route" as keyof View,
      sortable: true,
      render: (value: any, vista: View) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">{vista.route}</code>
      )
    },
    {
      id: "modulo",
      label: "Módulo",
      accessor: "moduloId" as keyof View,
      render: (value: any, vista: View) => (
        <Badge variant="secondary">
          {vista.modulo?.name || "Sin módulo"}
        </Badge>
      )
    },
    {
      id: "state",
      label: "Estado",
      accessor: "state" as keyof View,
      render: (value: any, vista: View) => (
        <Badge variant={vista.state ? "default" : "secondary"}>
          {vista.state ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      id: "actions",
      label: "Acciones",
      accessor: "_id" as keyof View,
      render: (value: any, vista: View) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAssignPermissions(vista)}
            title="Asignar a Roles"
            className="text-blue-600 hover:text-blue-700"
          >
            <UserCheck className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCambiarEstado(vista._id, !vista.state)}
            title={vista.state ? "Desactivar" : "Activar"}
          >
            {vista.state ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(vista)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminar(vista._id)}
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
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Gestión de Vistas</h1>
              <p className="text-muted-foreground">Administra las vistas y rutas del sistema</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Vista
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Vistas del Sistema</CardTitle>
          <CardDescription>
            Lista de todas las vistas disponibles en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={vistas}
            columns={columns}
            isLoading={loading}
            showActions={false}
          />
        </CardContent>
      </Card>

      {/* Modal para crear/editar vista */}
      <CreateViewModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        modulos={modulos}
        editingView={editingView}
      />

      {/* Modal para asignar permisos */}
      <AssignPermissionsModal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        onSuccess={handleAssignSuccess}
        selectedView={selectedView}
      />
    </div>
  )
}
