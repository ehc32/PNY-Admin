"use client"

import { useState, useEffect } from "react"
import { Package, Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, Download, Upload, FileText, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { obtenerBienes, obtenerBienPorId, eliminarBien, cambiarEstadoBien, exportarBienes, importarBienes, type Asset, type AssetsResponse } from "@/lib/api/assets-service"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"
import { AssetDetailWindow } from "@/components/asset-detail-window"

export default function AssetsPage() {
  const { token } = useAuth()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAssets, setTotalAssets] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isDetailWindowOpen, setIsDetailWindowOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const limit = 15

  useEffect(() => {
    if (token) {
      cargarDatos()
    }
  }, [token])

  useEffect(() => {
    // Filtrar assets cuando cambie el término de búsqueda
    if (searchTerm) {
      const filtered = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.inventoryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.accountHolder.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredAssets(filtered)
    } else {
      setFilteredAssets(assets)
    }
  }, [searchTerm, assets])

  const cargarDatos = async (page: number = currentPage) => {
    if (!token) return
    
    setLoading(true)
    try {
      console.log(`Cargando página ${page} con límite ${limit}`)
      const response: AssetsResponse = await obtenerBienes(token, limit, page)
      setAssets(response.data || [])
      setTotalAssets(response.total || 0)
      setTotalPages(Math.ceil((response.total || 0) / limit))
      setCurrentPage(page)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast.error("Error al cargar los bienes")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    cargarDatos(page)
  }

  const handleViewDetails = async (asset: Asset) => {
    setLoadingDetails(true)
    try {
      // Pequeña pausa para mostrar la animación
      await new Promise(resolve => setTimeout(resolve, 500))
      const detailedAsset = await obtenerBienPorId(token!, asset._id)
      setSelectedAsset(detailedAsset)
      setIsDetailWindowOpen(true)
    } catch (error) {
      console.error("Error al cargar detalles:", error)
      toast.error("Error al cargar los detalles del bien")
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleEdit = (asset: Asset) => {
    // TODO: Implementar modal de edición
    toast.info("Función de edición en desarrollo")
  }

  const handleDelete = async (asset: Asset) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el bien "${asset.name}"?`)) return
    
    try {
      await eliminarBien(token!, asset._id)
      toast.success("Bien eliminado correctamente")
      cargarDatos()
    } catch (error) {
      console.error("Error al eliminar bien:", error)
      toast.error("Error al eliminar el bien")
    }
  }

  const handleToggleStatus = async (asset: Asset) => {
    try {
      await cambiarEstadoBien(token!, asset._id, !asset.status)
      toast.success(`Bien ${!asset.status ? 'activado' : 'desactivado'} correctamente`)
      cargarDatos()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error("Error al cambiar el estado del bien")
    }
  }

  const handleExport = async () => {
    try {
      const blob = await exportarBienes(token!)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `bienes_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success("Bienes exportados correctamente")
    } catch (error) {
      console.error("Error al exportar:", error)
      toast.error("Error al exportar los bienes")
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const result = await importarBienes(token!, file)
        toast.success(`Importación completada: ${result.success} bienes procesados`)
        if (result.errors.length > 0) {
          console.warn("Errores durante la importación:", result.errors)
        }
        cargarDatos()
      } catch (error) {
        console.error("Error al importar:", error)
        toast.error("Error al importar los bienes")
      }
    }
    input.click()
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES')
    } catch {
      return "N/A"
    }
  }

  const columns = [
    {
      id: "name",
      label: "Nombre",
      accessor: "name" as keyof Asset,
      sortable: true,
      render: (value: any, asset: Asset) => (
        <div>
          <div className="font-medium">{asset.name}</div>
          <div className="text-sm text-muted-foreground">{asset.equipmentType}</div>
        </div>
      )
    },
    {
      id: "brand",
      label: "Marca/Modelo",
      accessor: "brand" as keyof Asset,
      render: (value: any, asset: Asset) => (
        <div>
          <div className="font-medium">{asset.brand}</div>
          <div className="text-sm text-muted-foreground">{asset.modelo}</div>
        </div>
      )
    },
    {
      id: "serialNumber",
      label: "Número de Serie",
      accessor: "serialNumber" as keyof Asset,
      render: (value: any, asset: Asset) => (
        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{asset.serialNumber}</code>
      )
    },
    {
      id: "inventoryCode",
      label: "Código de Inventario",
      accessor: "inventoryCode" as keyof Asset,
      render: (value: any, asset: Asset) => (
        <code className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono">{asset.inventoryCode}</code>
      )
    },
    {
      id: "location",
      label: "Ubicación",
      accessor: "location" as keyof Asset,
      render: (value: any, asset: Asset) => (
        <span className="text-sm">{asset.location}</span>
      )
    },
    {
      id: "accountHolder",
      label: "Responsable",
      accessor: "accountHolder" as keyof Asset,
      render: (value: any, asset: Asset) => (
        <span className="text-sm font-medium">{asset.accountHolder}</span>
      )
    },
    {
      id: "acquisitionDate",
      label: "Fecha de Adquisición",
      accessor: "acquisitionDate" as keyof Asset,
      render: (value: any, asset: Asset) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(asset.acquisitionDate)}
        </span>
      )
    },
    {
      id: "status",
      label: "Estado",
      accessor: "status" as keyof Asset,
      render: (value: any, asset: Asset) => (
        <Badge variant={asset.status ? "default" : "secondary"}>
          {asset.status ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      id: "actions",
      label: "Acciones",
      accessor: "_id" as keyof Asset,
      render: (value: any, asset: Asset) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(asset)}
            title="Ver detalles"
            className="text-blue-600 hover:text-blue-700"
            disabled={loadingDetails}
          >
            {loadingDetails ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(asset)}
            title="Editar"
            className="text-green-600 hover:text-green-700"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(asset)}
            title={asset.status ? "Desactivar" : "Activar"}
            className="text-orange-600 hover:text-orange-700"
          >
            {asset.status ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(asset)}
            title="Eliminar"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6 max-w-full mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestión de Bienes</h1>
            <p className="text-muted-foreground">
              Administra los bienes y activos del sistema ({totalAssets} elementos)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, marca, modelo, serie, código o responsable..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avanzados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="relative">
        {/* Overlay de carga */}
        {loadingDetails && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                Cargando detalles del bien...
              </p>
            </div>
          </div>
        )}
        
        <CardHeader>
          <CardTitle>Bienes del Sistema</CardTitle>
          <CardDescription>
            Lista de todos los bienes registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={searchTerm ? filteredAssets : assets}
            columns={columns}
            isLoading={loading}
            showActions={false}
          />
          
          {/* Paginación */}
          {!searchTerm && totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {((currentPage - 1) * limit) + 1} a {Math.min(currentPage * limit, totalAssets)} de {totalAssets} elementos
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ventana de detalles */}
      <AssetDetailWindow
        isOpen={isDetailWindowOpen}
        onClose={() => setIsDetailWindowOpen(false)}
        asset={selectedAsset}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  )
}
