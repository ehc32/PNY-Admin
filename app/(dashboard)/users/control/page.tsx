"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GenericTable, type TableColumn } from "@/components/generic-table"
import { getUsers, deleteUser, type User } from "@/lib/api/users-service"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

export default function GestionUsuariosPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const usersData = await getUsers(token)
      setUsers(usersData)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cargar usuarios")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleView = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedUser || !token) return

    setIsDeleting(true)
    try {
      await deleteUser(selectedUser._id, token)
      toast.success("Usuario eliminado correctamente")
      setIsDeleteDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar usuario")
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: TableColumn<User>[] = [
    {
      id: "name",
      label: "Nombre",
      accessor: "name",
      sortable: true,
    },
    {
      id: "email",
      label: "Email",
      accessor: "email",
      sortable: true,
    },
    {
      id: "phone",
      label: "Teléfono",
      accessor: "phone",
    },
    {
      id: "document",
      label: "Documento",
      accessor: "numberDocument",
      render: (value, row) => (
        <div className="space-y-1">
          <div className="font-medium">{value}</div>
          <div className="text-xs text-muted-foreground">{row.typeDocument}</div>
        </div>
      ),
    },
    {
      id: "rol",
      label: "Rol",
      accessor: "assignedRol",
      render: (value) =>
        value ? (
          <Badge variant="default">{value.name}</Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Sin rol
          </Badge>
        ),
    },
    {
      id: "state",
      label: "Estado",
      accessor: "state",
      render: (value) => {
        const isActive = value === true || value === "active"
        const isPending = value === false || value === "pending" || !value
        
        if (isActive) {
          return (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
              ✓ Activo
            </Badge>
          )
        }
        if (isPending) {
          return (
            <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
              ⏳ Pendiente
            </Badge>
          )
        }
        return (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
            ✕ Inactivo
          </Badge>
        )
      },
    },
  ]

  return (
    <>
      <GenericTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        onNew={() => router.push("/users/add")}
        onEdit={handleView}
        onDelete={handleDeleteClick}
        onRefresh={fetchData}
        title="Gestión de Usuarios"
        description="Visualiza y administra todos los usuarios del sistema"
        showActions={true}
        pageSize={10}
        searchPlaceholder="Buscar por nombre..."
      />

      {/* Dialog para ver detalles */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
            <DialogDescription>Información completa del usuario seleccionado</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Nombre completo</div>
                  <div className="font-semibold">{selectedUser.name}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Estado</div>
                  <Badge variant="outline">{selectedUser.state || "Pendiente"}</Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div>{selectedUser.email}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Teléfono</div>
                  <div>{selectedUser.phone}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Tipo de documento</div>
                  <div>{selectedUser.typeDocument}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Número de documento</div>
                  <div className="font-mono">{selectedUser.numberDocument}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Rol asignado</div>
                  <div>
                    {selectedUser.assignedRol ? (
                      <Badge variant="default">
                        {typeof selectedUser.assignedRol === 'string' 
                          ? selectedUser.assignedRol 
                          : selectedUser.assignedRol.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Sin rol</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Posición</div>
                  <div>
                    {selectedUser.assignedPosition ? (
                      <Badge variant="secondary">{selectedUser.assignedPosition}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Sin posición</span>
                    )}
                  </div>
                </div>
              </div>

              {selectedUser.createdAt && (
                <div className="pt-4 border-t space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Fecha de registro</div>
                  <div className="text-sm">{new Date(selectedUser.createdAt).toLocaleString("es-ES")}</div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <p className="text-sm">
                ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser.name}</strong>?
              </p>
              <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-muted-foreground">
                  Se eliminará toda la información asociada a este usuario.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
