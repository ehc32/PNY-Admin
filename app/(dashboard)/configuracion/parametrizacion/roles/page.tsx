"use client"

import { useState, useEffect } from "react"
import { Shield, ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { obtenerRoles, eliminarRol, cambiarEstadoRol, type Role } from "@/lib/api/roles-service"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"
import { CreateRoleModal } from "@/components/create-role-modal"

export default function RolesPage() {
  const { token } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  useEffect(() => {
    if (token) {
      cargarDatos()
    }
  }, [token])

  const cargarDatos = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const rolesData = await obtenerRoles(token)
      setRoles(rolesData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast.error("Error al cargar los roles")
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string) => {
    if (!token) return
    
    if (!confirm("¿Estás seguro de que deseas eliminar este rol?")) return
    
    try {
      await eliminarRol(token, id)
      toast.success("Rol eliminado correctamente")
      cargarDatos()
    } catch (error) {
      console.error("Error al eliminar rol:", error)
      toast.error("Error al eliminar el rol")
    }
  }

  const handleCambiarEstado = async (id: string, nuevoEstado: boolean) => {
    if (!token) return
    
    try {
      await cambiarEstadoRol(token, id, nuevoEstado)
      toast.success(`Rol ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`)
      cargarDatos()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error("Error al cambiar el estado del rol")
    }
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setIsCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditingRole(null)
  }

  const handleSuccess = () => {
    cargarDatos()
    handleCloseModal()
  }

  const columns = [
    {
      id: "name",
      label: "Nombre",
      accessor: "name" as keyof Role,
      sortable: true,
      render: (value: any, role: Role) => (
        <div>
          <div className="font-medium">{role.name}</div>
          <div className="text-sm text-muted-foreground">{role.description}</div>
        </div>
      )
    },
    {
      id: "views",
      label: "Vistas Asignadas",
      accessor: "views" as keyof Role,
      render: (value: any, role: Role) => (
        <Badge variant="outline">
          {role.views?.length || 0} vistas
        </Badge>
      )
    },
    {
      id: "state",
      label: "Estado",
      accessor: "state" as keyof Role,
      render: (value: any, role: Role) => (
        <Badge variant={role.state ? "default" : "secondary"}>
          {role.state ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      id: "createdAt",
      label: "Fecha de Creación",
      accessor: "createdAt" as keyof Role,
      render: (value: any, role: Role) => (
        <span className="text-sm text-muted-foreground">
          {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "N/A"}
        </span>
      )
    },
    {
      id: "actions",
      label: "Acciones",
      accessor: "_id" as keyof Role,
      render: (value: any, role: Role) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCambiarEstado(role._id, !role.state)}
            title={role.state ? "Desactivar" : "Activar"}
          >
            {role.state ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(role)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminar(role._id)}
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
              <h1 className="text-3xl font-bold">Gestión de Roles</h1>
              <p className="text-muted-foreground">Administra los roles del sistema</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Rol
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Roles del Sistema</CardTitle>
          <CardDescription>
            Lista de todos los roles disponibles en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={roles}
            columns={columns}
            isLoading={loading}
            showActions={false}
          />
        </CardContent>
      </Card>

      {/* Modal para crear/editar rol */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editingRole={editingRole}
      />
    </div>
  )
}
