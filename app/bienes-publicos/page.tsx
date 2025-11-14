"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Package, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Interfaz simplificada para bienes públicos (sin datos sensibles)
interface PublicAsset {
  _id: string
  name: string
  brand: string
  modelo: string
  equipmentType: string
  status: boolean
}

export default function BienesPublicosPage() {
  const router = useRouter()
  const [assets, setAssets] = useState<PublicAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAssets, setFilteredAssets] = useState<PublicAsset[]>([])

  useEffect(() => {
    // Simulación de carga de datos públicos (sin autenticación)
    const loadPublicAssets = async () => {
      setLoading(true)
      try {
        // Simulación de datos públicos
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockAssets: PublicAsset[] = [
          {
            _id: "1",
            name: "Computador Portátil",
            brand: "Lenovo",
            modelo: "ThinkPad X1",
            equipmentType: "Computador",
            status: true
          },
          {
            _id: "2", 
            name: "Impresora Láser",
            brand: "HP",
            modelo: "LaserJet Pro",
            equipmentType: "Impresora",
            status: true
          },
          {
            _id: "3",
            name: "Monitor LED",
            brand: "Samsung",
            modelo: "24 pulgadas",
            equipmentType: "Monitor",
            status: true
          },
          {
            _id: "4",
            name: "Proyector",
            brand: "Epson",
            modelo: "PowerLite",
            equipmentType: "Proyector",
            status: false
          }
        ]
        
        setAssets(mockAssets)
        setFilteredAssets(mockAssets)
      } catch (error) {
        console.error("Error al cargar bienes:", error)
        toast.error("Error al cargar los bienes")
      } finally {
        setLoading(false)
      }
    }

    loadPublicAssets()
  }, [])

  useEffect(() => {
    // Filtrar assets cuando cambie el término de búsqueda
    if (searchTerm) {
      const filtered = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.equipmentType.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredAssets(filtered)
    } else {
      setFilteredAssets(assets)
    }
  }, [searchTerm, assets])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/mantenimiento")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Consulta de Bienes Registrados
            </h1>
            <p className="text-xl opacity-90">
              Consulta los bienes disponibles en el sistema
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Buscador */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
                <Search className="h-6 w-6" />
                Buscar Bienes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, marca, modelo o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de bienes */}
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="h-6 w-6" />
                Bienes Disponibles ({filteredAssets.length})
              </CardTitle>
              <CardDescription>
                Lista de bienes registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando bienes...</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? "No se encontraron bienes con ese criterio de búsqueda" : "No hay bienes disponibles"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAssets.map((asset) => (
                    <Card key={asset._id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-800 mb-1">
                              {asset.name}
                            </CardTitle>
                            <p className="text-sm text-gray-600">{asset.equipmentType}</p>
                          </div>
                          <Badge variant={asset.status ? "default" : "secondary"} className="ml-2">
                            {asset.status ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Marca:</span>
                            <span className="font-medium">{asset.brand}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Modelo:</span>
                            <span className="font-medium">{asset.modelo}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => toast.info("Información básica del bien mostrada")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver información básica
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                ¿Necesitas más información?
              </h3>
              <p className="text-blue-700 mb-4">
                Para acceder a información detallada de los bienes, debes iniciar sesión en el sistema.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => router.push("/login")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push("/mantenimiento")}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Volver al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
