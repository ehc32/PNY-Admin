"use client"

import { useState, useEffect } from "react"
import { GenericTable, type TableColumn } from "@/components/generic-table"
import { getUsers, getRoles, updateUser, type User, type Rol } from "@/lib/api/users-service"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function ControlAccesoPage() {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRol, setSelectedRol] = useState<string>("")
  const [selectedPosition, setSelectedPosition] = useState<string>("")
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const [usersData, rolesData] = await Promise.all([getUsers(token), getRoles(token)])
      // Filtrar solo usuarios pendientes (state: false)
      const pendingUsers = usersData.filter(user => {
        const state = user.state
        return state === false || state === "pending" || !state
      })
      setUsers(pendingUsers)
      setRoles(rolesData)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cargar datos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditPhone(user.phone)
    const rolId = typeof user.assignedRol === 'string' ? user.assignedRol : user.assignedRol?._id || ""
    setSelectedRol(rolId)
    setSelectedPosition(user.assignedPosition || "")
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!selectedUser || !token) return

    // Validación básica
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
        state: true, // Activar el usuario al asignarle acceso
      }
      if (selectedRol) updateData.assignedRol = selectedRol
      if (selectedPosition) updateData.assignedPosition = selectedPosition

      await updateUser(selectedUser._id, updateData, token)
      toast.success("Usuario activado y acceso asignado correctamente")
      setIsDialogOpen(false)
      setSelectedUser(null)
      setSelectedRol("")
      setSelectedPosition("")
      setEditName("")
      setEditEmail("")
      setEditPhone("")
      // Recargar datos después de un pequeño delay para asegurar que el backend actualizó
      setTimeout(() => {
        fetchData()
      }, 300)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar")
    } finally {
      setIsSaving(false)
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
      label: "Rol Asignado",
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
      id: "position",
      label: "Posición",
      accessor: "assignedPosition",
      render: (value) =>
        value ? (
          <Badge variant="secondary">{value}</Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Sin posición
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
        onEdit={handleEdit}
        onRefresh={fetchData}
        title="Control de Acceso"
        description="Aprueba y asigna roles a usuarios pendientes de activación"
        showActions={true}
        pageSize={10}
        searchPlaceholder="Buscar por nombre..."
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Asignar Acceso</DialogTitle>
            <DialogDescription>Configura el rol y posición del usuario en el sistema</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Usuario</div>
                <div className="rounded-lg border p-3 space-y-1">
                  <div className="font-semibold">{selectedUser.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedUser.typeDocument}: {selectedUser.numberDocument}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select value={selectedRol || "none"} onValueChange={(v) => setSelectedRol(v === "none" ? "" : v)}>
                  <SelectTrigger id="rol">
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
                <Label htmlFor="position">Posición</Label>
                <Select value={selectedPosition || "none"} onValueChange={(v) => setSelectedPosition(v === "none" ? "" : v)}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Selecciona una posición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin posición</SelectItem>
                    <SelectItem value="Contratista">Contratista</SelectItem>
                    <SelectItem value="Planta">Planta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
