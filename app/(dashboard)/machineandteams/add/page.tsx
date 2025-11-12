"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Edit, Trash2, Eye, Settings } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { obtenerCategorias, eliminarCategoria, cambiarEstadoCategoria, type Category } from "@/lib/api/categories-service"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"
import { CreateCategoryModal } from "@/components/create-category-modal"
import { ViewCategoryModal } from "@/components/view-category-modal"

export default function CategoriasPage() {
  const { token } = useAuth()
  const [categorias, setCategorias] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null)

  useEffect(() => {
    if (token) {
      cargarCategorias()
    }
  }, [token])

  const cargarCategorias = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const data = await obtenerCategorias(token)
      setCategorias(data)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
      toast.error("Error al cargar las categorías")
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id: string) => {
    if (!token) return
    
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return
    
    try {
      await eliminarCategoria(token, id)
      toast.success("Categoría eliminada correctamente")
      cargarCategorias()
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
      toast.error("Error al eliminar la categoría")
    }
  }

  const handleCambiarEstado = async (id: string, currentState: boolean) => {
    if (!token) return
    
    try {
      await cambiarEstadoCategoria(token, id, !currentState)
      toast.success(`Categoría ${!currentState ? 'activada' : 'desactivada'} correctamente`)
      cargarCategorias()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      toast.error("Error al cambiar el estado de la categoría")
    }
  }

  const handleEditar = (category: Category) => {
    setEditingCategory(category)
    setIsCreateModalOpen(true)
  }

  const handleVerDetalles = (category: Category) => {
    setViewingCategory(category)
    setIsViewModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditingCategory(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewingCategory(null)
  }

  const handleSuccess = () => {
    cargarCategorias()
    handleCloseModal()
  }

  const columns = [
    {
      id: "name",
      label: "Nombre",
      accessor: "name" as keyof Category,
      sortable: true,
      render: (value: any, category: Category) => (
        <div className="font-medium">{category.name}</div>
      )
    },
    {
      id: "operationVars",
      label: "Variables de Operación",
      accessor: "operationVars" as keyof Category,
      render: (value: any, category: Category) => (
        <div className="flex flex-wrap gap-1">
          {category.operationVars.slice(0, 2).map((variable, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {variable}
            </Badge>
          ))}
          {category.operationVars.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{category.operationVars.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    {
      id: "accessories",
      label: "Accesorios",
      accessor: "accessories" as keyof Category,
      render: (value: any, category: Category) => (
        <div className="flex flex-wrap gap-1">
          {category.accessories.slice(0, 2).map((accessory, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {accessory}
            </Badge>
          ))}
          {category.accessories.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{category.accessories.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    {
      id: "specs",
      label: "Especificaciones",
      accessor: "specs" as keyof Category,
      render: (value: any, category: Category) => (
        <div className="text-sm text-muted-foreground">
          {category.specs.length} especificación{category.specs.length !== 1 ? 'es' : ''}
        </div>
      )
    },
    {
      id: "state",
      label: "Estado",
      accessor: "state" as keyof Category,
      render: (value: any, category: Category) => (
        <Badge variant={category.state ? "default" : "secondary"}>
          {category.state ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      id: "createdAt",
      label: "Fecha de Creación",
      accessor: "createdAt" as keyof Category,
      render: (value: any, category: Category) => (
        <div className="text-sm text-muted-foreground">
          {new Date(category.createdAt).toLocaleDateString("es-ES")}
        </div>
      )
    },
    {
      id: "actions",
      label: "Acciones",
      accessor: "_id" as keyof Category,
      render: (value: any, category: Category) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVerDetalles(category)}
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditar(category)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCambiarEstado(category._id, category.state)}
            title={category.state ? "Desactivar" : "Activar"}
            className={category.state ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminar(category._id)}
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
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
              <p className="text-muted-foreground">Administra las categorías de equipos y máquinas</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías del Sistema</CardTitle>
          <CardDescription>
            Lista de todas las categorías disponibles para equipos y máquinas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={categorias}
            columns={columns}
            isLoading={loading}
            showActions={false}
          />
        </CardContent>
      </Card>

      {/* Modal para crear/editar categoría */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editingCategory={editingCategory}
      />

      {/* Modal para ver detalles */}
      
      <ViewCategoryModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        category={viewingCategory}
      />
    </div>
  )
}
