"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GenericTable, type TableColumn } from "@/components/generic-table"
import { getUsers, getRoles, updateUser, deleteUser, type User, type Rol } from "@/lib/api/users-service"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Eye } from "lucide-react"

export default function GestionUsuariosPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form states for editing
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editTypeDocument, setEditTypeDocument] = useState("")
  const [editNumberDocument, setEditNumberDocument] = useState("")
  const [editRol, setEditRol] = useState("")
  const [editPosition, setEditPosition] = useState("")
  const [editState, setEditState] = useState("")

  const fetchData = async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const [usersData, rolesData] = await Promise.all([getUsers(token), getRoles(token)])
      setUsers(usersData)
      setRoles(rolesData)
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

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditPhone(user.phone)
    setEditTypeDocument(user.typeDocument)
    setEditNumberDocument(user.numberDocument)
    const rolId = typeof user.assignedRol === 'string' ? user.assignedRol : user.assignedRol?._id || ""
    setEditRol(rolId)
    setEditPosition(user.assignedPosition || "")
    // Convert state to string for select
    if (user.state === true || user.state === "active") {
      setEditState("active")
    } else if (user.state === false || user.state === "pending" || !user.state) {
      setEditState("pending")
    } else {
      setEditState("inactive")
    }
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedUser || !token) return

    // Validation
    if (!editName.trim() || !editEmail.trim() || !editPhone.trim()) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setIsSaving(true)
    try {
      const updateData: any = {
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        typeDocument: editTypeDocument,
        numberDocument: editNumberDocument,
      }

      if (editRol) updateData.assignedRol = editRol
      if (editPosition) updateData.assignedPosition = editPosition

      // Set state as boolean
      if (editState === "active") {
        updateData.state = true
      } else if (editState === "pending") {
        updateData.state = false
      } else {
        updateData.state = false
      }

      await updateUser(selectedUser._id, updateData, token)
      toast.success("Usuario actualizado correctamente")
      setIsEditDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar usuario")
    } finally {
      setIsSaving(false)
    }
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
              Pendiente
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
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onRefresh={fetchData}
        title="Gestión de Usuarios"
        description="Visualiza y administra todos los usuarios del sistema"
        showActions={true}
        pageSize={10}
        searchPlaceholder="Buscar por nombre..."
        rowActions={[
          {
            id: "view",
            label: "Ver detalles",
            icon: <Eye className="h-4 w-4" />,
            onClick: handleView,
          },
        ]}
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

      {/* Dialog para editar usuario */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Modifica la información del usuario</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre completo *</Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Teléfono *</Label>
                  <Input
                    id="edit-phone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Teléfono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type-document">Tipo de documento</Label>
                  <Select value={editTypeDocument} onValueChange={setEditTypeDocument}>
                    <SelectTrigger id="edit-type-document" className="pl-10 h-11 w-full">
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">CC - Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="TI">TI - Tarjeta de Identidad</SelectItem>
                      <SelectItem value="CE">CE - Cédula de Extranjería</SelectItem>
                      <SelectItem value="PA">PA - Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-number-document">Número de documento</Label>
                  <Input
                    id="edit-number-document"
                    value={editNumberDocument}
                    onChange={(e) => setEditNumberDocument(e.target.value)}
                    placeholder="Número de documento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-rol">Rol</Label>
                  <Select value={editRol || "none"} onValueChange={(v) => setEditRol(v === "none" ? "" : v)}>
                    <SelectTrigger id="edit-rol" className="pl-10 h-11 w-full">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin rol</SelectItem>
                      {roles.map((rol) => (
                        <SelectItem key={rol._id} value={rol._id}>
                          {rol.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-position">Posición</Label>
                  <Select value={editPosition || "none"} onValueChange={(v) => setEditPosition(v === "none" ? "" : v)}>
                    <SelectTrigger id="edit-position" className="pl-10 h-11 w-full">
                      <SelectValue placeholder="Selecciona una posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin posición</SelectItem>
                      <SelectItem value="Contratista">Contratista</SelectItem>
                      <SelectItem value="Planta">Planta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-state">Estado</Label>
                  <Select value={editState} onValueChange={setEditState}>
                    <SelectTrigger id="edit-state" className="pl-10 h-11 w-full">
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
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
