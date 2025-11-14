"use client"

import { useState, useEffect } from "react"
import { Folder, ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { obtenerModulos, type Modulo } from "@/lib/api/views-service"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"

export default function ModulosPage() {
  const { token } = useAuth()
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      cargarDatos()
    }
  }, [token])

  const cargarDatos = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const modulosData = await obtenerModulos(token)
      setModulos(modulosData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast.error("Error al cargar los módulos")
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string) => {
    if (!token) return
    
    if (!confirm("¿Estás seguro de que deseas eliminar este módulo?")) return
    
    try {
      // TODO: Implementar función de eliminación
      toast.success("Módulo eliminado correctamente")
      cargarDatos()
    } catch (error) {
      console.error("Error al eliminar módulo:", error)
      toast.error("Error al eliminar el módulo")
    }
  }

  const handleCambiarEstado = async (id: string, nuevoEstado: boolean) => {
    if (!token) return
    
    try {
      // TODO: Implementar función de cambio de estado
      toast.success(`Módulo ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`)
      cargarDatos()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error("Error al cambiar el estado del módulo")
    }
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
          <div className="text-sm text-muted-foreground">{modulo.description}</div>
        </div>
      )
    },
    {
      id: "route",
      label: "Ruta Base",
      accessor: "route" as keyof Modulo,
      sortable: true,
      render: (value: any, modulo: Modulo) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">{modulo.state}</code>
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
            onClick={() => {/* TODO: Implementar edición */}}
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
            <Folder className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Gestión de Módulos</h1>
              <p className="text-muted-foreground">Administra los módulos del sistema</p>
            </div>
          </div>
        </div>
        <Button onClick={() => toast.info("Función en desarrollo")}>
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
    </div>
  )
}
