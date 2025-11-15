"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { obtenerUsuarioPorId, actualizarPerfil, cambiarPassword, type UserProfile, type UpdatePasswordData } from "@/lib/api/user-service"
import { getMaintenanceStats, getWorkOrderStats, type MaintenanceStats, type WorkOrderStats } from "@/lib/api/statistics-service"
import { getUserIdFromToken } from "@/lib/jwt-utils"
import { User, Mail, Phone, IdCard, Shield, Edit3, Save, X, AlertCircle, Loader2, Activity, CheckCircle, Clock, AlertTriangle, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function PerfilPage() {
  const { token } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [editData, setEditData] = useState<Partial<UserProfile>>({})
  const [maintenanceStats, setMaintenanceStats] = useState<MaintenanceStats | null>(null)
  const [workOrderStats, setWorkOrderStats] = useState<WorkOrderStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState<UpdatePasswordData>({
    currentPassword: "",
    newPassword: ""
  })
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (token) {
      cargarPerfil()
      cargarEstadisticas()
    }
  }, [token])

  const cargarPerfil = async () => {
    if (!token) return

    try {
      setLoading(true)
      
      // Obtener ID del usuario desde el token
      const userId = getUserIdFromToken(token)
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario")
      }

      // Obtener datos del usuario por ID
      const data = await obtenerUsuarioPorId(token, userId)
      setUserData(data)
      setEditData(data)
    } catch (error) {
      console.error("Error al cargar perfil:", error)
      toast.error("Error al cargar la información del perfil")
    } finally {
      setLoading(false)
    }
  }

  const cargarEstadisticas = async () => {
    if (!token) return

    try {
      setStatsLoading(true)
      
      // Cargar estadísticas en paralelo
      const [maintenanceData, workOrderData] = await Promise.allSettled([
        getMaintenanceStats(token),
        getWorkOrderStats(token)
      ])

      if (maintenanceData.status === 'fulfilled') {
        setMaintenanceStats(maintenanceData.value)
      }

      if (workOrderData.status === 'fulfilled') {
        setWorkOrderStats(workOrderData.value)
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error)
      // No mostramos toast de error para estadísticas, solo las ocultamos
    } finally {
      setStatsLoading(false)
    }
  }

  const handleEdit = () => {
    if (userData) {
      setEditData(userData)
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    if (userData) {
      setEditData(userData)
      setIsEditing(false)
    }
  }

  const handleSave = async () => {
    if (!token || !userData) return

    setSaving(true)
    try {
      const updatedUser = await actualizarPerfil(token, editData)
      setUserData(updatedUser)
      setIsEditing(false)
      toast.success("Perfil actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      toast.error("Error al actualizar el perfil")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!token || !passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Por favor completa todos los campos")
      return
    }

    setChangingPassword(true)
    try {
      await cambiarPassword(token, passwordData)
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: "", newPassword: "" })
      toast.success("Contraseña cambiada correctamente")
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      toast.error("Error al cambiar la contraseña")
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-muted-foreground">Cargando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No se pudo cargar la información del perfil. Intenta recargar la página.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const initials = userData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "U"
  
  // Helper function to get role name
  const getRoleName = (rol: string | { _id: string; name: string } | undefined): string => {
    if (!rol) return "Usuario"
    if (typeof rol === 'string') return rol
    return rol.name
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with primary accent */}
      <div className="bg-primary text-primary-foreground px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Perfil de administrador</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* Profile Information Card */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-border">
                  <AvatarImage src="" alt={userData.name} />
                  <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Información del usuario */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Información del usuario</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Nombre de usuario</p>
                    {isEditing ? (
                      <Input
                        value={editData.name || ""}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">{userData.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contactos */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Contactos</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Correo electrónico</p>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editData.email || ""}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">{userData.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cargos */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Cargos</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Cargo desempeñado</p>
                    {isEditing ? (
                      <Input
                        value={editData.assignedPosition || ""}
                        onChange={(e) => setEditData({...editData, assignedPosition: e.target.value})}
                        className="text-sm"
                        placeholder="Sin cargo asignado"
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">{userData.assignedPosition || "Sin cargo asignado"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Info Row */}
          <Separator className="my-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Tipo de documento</p>
              <p className="text-sm font-medium text-foreground">{userData.typeDocument}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Número de creditos</p>
              <p className="text-sm font-medium text-foreground">{userData.numberDocument}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rol asignado</p>
              <p className="text-sm font-medium text-foreground">{getRoleName(userData.assignedRol)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar cambios
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={saving}
                  className="border-border"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Actualizar perfil
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordModal(true)}
                  className="border-border"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Cambiar contraseña
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Statistics Cards */}
      {!statsLoading && (maintenanceStats || workOrderStats) && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">Solicitudes de actividades de mantenimiento</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Maintenance Statistics */}
              {maintenanceStats && (
                <>
                  <Card className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Solicitudes</p>
                          <p className="text-3xl font-bold text-foreground">{maintenanceStats.All}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                          <Activity className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Ejecutadas</p>
                          <p className="text-3xl font-bold text-foreground">{maintenanceStats.Executed}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total pendientes</p>
                          <p className="text-3xl font-bold text-foreground">{maintenanceStats.Pending}</p>
                        </div>
                        <div className="bg-orange-100 rounded-full p-3">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            <h2 className="text-xl font-semibold text-primary mb-4">Órdenes de trabajo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Work Order Statistics */}
              {workOrderStats && (
                <>
                  <Card className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Órdenes Trabajo</p>
                          <p className="text-3xl font-bold text-foreground">{workOrderStats.resumen.total}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                          <Activity className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total OT Ejecutadas</p>
                          <p className="text-3xl font-bold text-foreground">{workOrderStats.resumen.ejecutadas}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Vencidas</p>
                          <p className="text-3xl font-bold text-foreground">{workOrderStats.resumen.vencidas}</p>
                        </div>
                        <div className="bg-red-100 rounded-full p-3">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Lock className="h-5 w-5" />
                Cambiar Contraseña
              </CardTitle>
              <CardDescription>
                Ingresa tu contraseña actual y la nueva contraseña
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Ingresa tu nueva contraseña"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePasswordChange}
                  disabled={changingPassword}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Cambiar Contraseña
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordData({ currentPassword: "", newPassword: "" })
                  }}
                  disabled={changingPassword}
                  className="border-border"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      </div>
    </div>
  )
}
