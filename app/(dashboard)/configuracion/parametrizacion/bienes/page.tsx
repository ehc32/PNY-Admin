"use client"

import { useState, useEffect } from "react"
import { Package, ArrowLeft, Search, Filter, Eye } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { obtenerBienes, type Asset, type AssetsResponse } from "@/lib/api/assets-service"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"

export default function BienesPage() {
  const { token } = useAuth()
  const [bienes, setBienes] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBienes, setFilteredBienes] = useState<Asset[]>([])
  const limit = 10

  useEffect(() => {
    if (token) {
      cargarDatos()
    }
  }, [token, currentPage])

  useEffect(() => {
    // Filtrar bienes cuando cambie el término de búsqueda
    if (searchTerm) {
      const filtered = bienes.filter(bien =>
        bien.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bien.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bien.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bien.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bien.inventoryCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBienes(filtered)
    } else {
      setFilteredBienes(bienes)
    }
  }, [searchTerm, bienes])

  const cargarDatos = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const response: AssetsResponse = await obtenerBienes(token, limit, currentPage)
      setBienes(response.data || [])
      setTotalPages(Math.ceil((response.total || 0) / limit))
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast.error("Error al cargar los bienes")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES')
    } catch {
      return "N/A"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount)
  }

  const columns = [
    {
      id: "name",
      label: "Nombre",
      accessor: "name" as keyof Asset,
      sortable: true,
      render: (value: any, bien: Asset) => (
        <div>
          <div className="font-medium">{bien.name}</div>
          <div className="text-sm text-muted-foreground">{bien.equipmentType}</div>
        </div>
      )
    },
    {
      id: "brand",
      label: "Marca/Modelo",
      accessor: "brand" as keyof Asset,
      render: (value: any, bien: Asset) => (
        <div>
          <div className="font-medium">{bien.brand}</div>
          <div className="text-sm text-muted-foreground">{bien.modelo}</div>
        </div>
      )
    },
    {
      id: "serialNumber",
      label: "Número de Serie",
      accessor: "serialNumber" as keyof Asset,
      render: (value: any, bien: Asset) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">{bien.serialNumber}</code>
      )
    },
    {
      id: "inventoryCode",
      label: "Código de Inventario",
      accessor: "inventoryCode" as keyof Asset,
      render: (value: any, bien: Asset) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">{bien.inventoryCode}</code>
      )
    },
    {
      id: "location",
      label: "Ubicación",
      accessor: "location" as keyof Asset,
      render: (value: any, bien: Asset) => (
        <span className="text-sm">{bien.location}</span>
      )
    },
    {
      id: "accountHolder",
      label: "Responsable",
      accessor: "accountHolder" as keyof Asset,
      render: (value: any, bien: Asset) => (
        <span className="text-sm">{bien.accountHolder}</span>
      )
    },
    {
      id: "acquisitionDate",
      label: "Fecha de Adquisición",
      accessor: "acquisitionDate" as keyof Asset,
      render: (value: any, bien: Asset) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(bien.acquisitionDate)}
        </span>
      )
    },
    {
      id: "status",
      label: "Estado",
      accessor: "status" as keyof Asset,
      render: (value: any, bien: Asset) => (
        <Badge variant={bien.status ? "default" : "secondary"}>
          {bien.status ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      id: "actions",
      label: "Acciones",
      accessor: "_id" as keyof Asset,
      render: (value: any, bien: Asset) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
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
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Gestión de Bienes</h1>
              <p className="text-muted-foreground">Administra los bienes y activos del sistema</p>
            </div>
          </div>
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
                  placeholder="Buscar por nombre, marca, modelo, serie o código..."
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
      <Card>
        <CardHeader>
          <CardTitle>Bienes del Sistema</CardTitle>
          <CardDescription>
            Lista de todos los bienes registrados en el sistema ({filteredBienes.length} elementos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={filteredBienes}
            columns={columns}
            isLoading={loading}
            showActions={false}
          />
          
          {/* Paginación */}
          {!searchTerm && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
