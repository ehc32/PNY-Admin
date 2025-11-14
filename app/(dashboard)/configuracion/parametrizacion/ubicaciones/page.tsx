"use client"

import { useState, useEffect } from "react"
import { MapPin, ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"

// Interfaz temporal para ubicaciones
interface Ubicacion {
  _id: string
  name: string
  description?: string
  address?: string
  state: boolean
  createdAt: string
  updatedAt: string
}

export default function UbicacionesPage() {
  const { token } = useAuth()
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([])
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
      // TODO: Implementar servicio de ubicaciones
      // const ubicacionesData = await obtenerUbicaciones(token)
      // setUbicaciones(ubicacionesData)
      
      // Datos de ejemplo mientras se implementa el servicio
      setUbicaciones([
        {
          _id: "1",
          name: "Oficina Principal",
          description: "Sede principal de la empresa",
          address: "Calle 123 #45-67",
          state: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "2", 
          name: "Almacén Central",
          description: "Almacén principal de inventarios",
          address: "Carrera 89 #12-34",
          state: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast.error("Error al cargar las ubicaciones")
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string) => {
    if (!token) return
    
    if (!confirm("¿Estás seguro de que deseas eliminar esta ubicación?")) return
    
    try {
      // TODO: Implementar función de eliminación
      toast.success("Ubicación eliminada correctamente")
      cargarDatos()
    } catch (error) {
      console.error("Error al eliminar ubicación:", error)
      toast.error("Error al eliminar la ubicación")
    }
  }

  const handleCambiarEstado = async (id: string, nuevoEstado: boolean) => {
    if (!token) return
    
    try {
      // TODO: Implementar función de cambio de estado
      toast.success(`Ubicación ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`)
      cargarDatos()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error("Error al cambiar el estado de la ubicación")
    }
  }

  const columns = [
    {
      id: "name",
      label: "Nombre",
      accessor: "name" as keyof Ubicacion,
      sortable: true,
      render: (value: any, ubicacion: Ubicacion) => (
        <div>
          <div className="font-medium">{ubicacion.name}</div>
          <div className="text-sm text-muted-foreground">{ubicacion.description}</div>
        </div>
      )
    },
    {
      id: "address",
      label: "Dirección",
      accessor: "address" as keyof Ubicacion,
      render: (value: any, ubicacion: Ubicacion) => (
        <span className="text-sm">{ubicacion.address || "N/A"}</span>
      )
    },
    {
      id: "state",
      label: "Estado",
      accessor: "state" as keyof Ubicacion,
      render: (value: any, ubicacion: Ubicacion) => (
        <Badge variant={ubicacion.state ? "default" : "secondary"}>
          {ubicacion.state ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      id: "createdAt",
      label: "Fecha de Creación",
      accessor: "createdAt" as keyof Ubicacion,
      render: (value: any, ubicacion: Ubicacion) => (
        <span className="text-sm text-muted-foreground">
          {new Date(ubicacion.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      id: "actions",
      label: "Acciones",
      accessor: "_id" as keyof Ubicacion,
      render: (value: any, ubicacion: Ubicacion) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCambiarEstado(ubicacion._id, !ubicacion.state)}
            title={ubicacion.state ? "Desactivar" : "Activar"}
          >
            {ubicacion.state ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.info("Función de edición en desarrollo")}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminar(ubicacion._id)}
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
              <h1 className="text-3xl font-bold">Gestión de Ubicaciones</h1>
              <p className="text-muted-foreground">Administra las ubicaciones del sistema</p>
            </div>
          </div>
        </div>
        <Button onClick={() => toast.info("Función en desarrollo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Ubicación
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicaciones del Sistema</CardTitle>
          <CardDescription>
            Lista de todas las ubicaciones disponibles en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={ubicaciones}
            columns={columns}
            isLoading={loading}
            showActions={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}
