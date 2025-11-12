"use client"

import { useState, useEffect } from "react"
import { FileText, ArrowLeft, Filter, Download, RefreshCw, Calendar, User, Activity, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { obtenerActionLogs, eliminarActionLog, type ActionLog, type ActionLogFilters } from "@/lib/api/action-logs-service"
import { obtenerModulos, type Modulo } from "@/lib/api/modulos-service"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"

export default function EventosPage() {
  const { token } = useAuth()
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([])
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)
  const [totalLogs, setTotalLogs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<ActionLogFilters>({
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    if (token) {
      cargarDatos()
    }
  }, [token])

  useEffect(() => {
    if (token) {
      cargarActionLogs()
    }
  }, [filters, token])

  const cargarDatos = async () => {
    if (!token) return
    
    try {
      const modulosData = await obtenerModulos(token)
      setModulos(modulosData)
    } catch (error) {
      console.error("Error al cargar módulos:", error)
      toast.error("Error al cargar los módulos")
    }
  }

  const cargarActionLogs = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const response = await obtenerActionLogs(token, filters)
      setActionLogs(response.data)
      setTotalLogs(response.total)
      setCurrentPage(response.page)
    } catch (error) {
      console.error("Error al cargar eventos:", error)
      toast.error("Error al cargar los eventos")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof ActionLogFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset page when changing other filters
    }))
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
    })
  }

  const exportLogs = () => {
    // Implementar exportación a CSV/Excel
    toast.info("Función de exportación en desarrollo")
  }

  const handleEliminar = async (id: string) => {
    if (!token) return
    
    if (!confirm("¿Estás seguro de que deseas eliminar este evento?")) return
    
    try {
      await eliminarActionLog(token, id)
      toast.success("Evento eliminado correctamente")
      cargarActionLogs()
    } catch (error) {
      console.error("Error al eliminar evento:", error)
      toast.error("Error al eliminar el evento")
    }
  }

  const columns = [
    {
      id: "dateTime",
      label: "Fecha y Hora",
      accessor: "dateTime" as keyof ActionLog,
      sortable: true,
      render: (value: any, log: ActionLog) => (
        <div className="text-sm">
          <div className="font-medium">
            {new Date(log.dateTime).toLocaleDateString("es-ES")}
          </div>
          <div className="text-muted-foreground">
            {new Date(log.dateTime).toLocaleTimeString("es-ES")}
          </div>
        </div>
      )
    },
    {
      id: "user",
      label: "Usuario",
      accessor: "userId" as keyof ActionLog,
      render: (value: any, log: ActionLog) => (
        <div className="text-sm">
          <div className="font-medium">{log.user?.name || "Usuario desconocido"}</div>
          <div className="text-muted-foreground">{log.user?.email}</div>
        </div>
      )
    },
    {
      id: "action",
      label: "Acción",
      accessor: "action" as keyof ActionLog,
      render: (value: any, log: ActionLog) => (
        <Badge variant="outline" className="font-mono">
          {log.action}
        </Badge>
      )
    },
    {
      id: "modulo",
      label: "Módulo",
      accessor: "moduloId" as keyof ActionLog,
      render: (value: any, log: ActionLog) => (
        <Badge variant="secondary">
          {log.modulo?.name || "Módulo desconocido"}
        </Badge>
      )
    },
    {
      id: "state",
      label: "Estado",
      accessor: "state" as keyof ActionLog,
      render: (value: any, log: ActionLog) => (
        <Badge variant={log.state ? "default" : "secondary"}>
          {log.state ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      id: "actions",
      label: "Acciones",
      accessor: "_id" as keyof ActionLog,
      render: (value: any, log: ActionLog) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEliminar(log._id)}
          className="text-destructive hover:text-destructive"
          title="Eliminar evento"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
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
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Eventos del Sistema</h1>
              <p className="text-muted-foreground">Consulta los logs y actividades del sistema</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={cargarActionLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="action">Acción</Label>
              <Input
                id="action"
                placeholder="Buscar por acción..."
                value={filters.action || ""}
                onChange={(e) => handleFilterChange("action", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moduloId">Módulo</Label>
              <Select
                value={filters.moduloId || "all"}
                onValueChange={(value) => handleFilterChange("moduloId", value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los módulos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los módulos</SelectItem>
                  {modulos.map((modulo) => (
                    <SelectItem key={modulo._id} value={modulo._id}>
                      {modulo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
            <div className="text-sm text-muted-foreground">
              {totalLogs} eventos encontrados
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Eventos</CardTitle>
          <CardDescription>
            Historial completo de actividades del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={actionLogs}
            columns={columns}
            isLoading={loading}
            showActions={false}
          />
          
          {/* Paginación personalizada */}
          {totalLogs > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {Math.ceil(totalLogs / (filters.limit || 10))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => handleFilterChange("page", currentPage - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= Math.ceil(totalLogs / (filters.limit || 10))}
                  onClick={() => handleFilterChange("page", currentPage + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
