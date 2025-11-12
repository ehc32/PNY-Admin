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
import { obtenerUsuarioPorId, actualizarPerfil, type UserProfile } from "@/lib/api/user-service"
import { getUserIdFromToken } from "@/lib/jwt-utils"
import { User, Mail, Phone, IdCard, Shield, Edit3, Save, X, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function PerfilPage() {
  const { token } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [editData, setEditData] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    if (token) {
      cargarPerfil()
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

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} className="gap-2">
            <Edit3 className="h-4 w-4" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="gap-2" disabled={saving}>
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary via-primary/90 to-primary/80 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        </div>
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-2 ring-primary/20">
              <AvatarImage src="" alt={userData.name} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-4">
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-muted-foreground">{userData.assignedPosition || "Sin cargo asignado"}</p>
              <Badge variant="secondary" className="mt-2">
                <Shield className="h-3 w-3 mr-1" />
                {userData.assignedRol || "Usuario"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Información Personal
            </CardTitle>
            <CardDescription>
              Datos básicos de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name || ""}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  placeholder="Ingresa tu nombre completo"
                />
              ) : (
                <p className="text-sm font-medium bg-muted/50 p-2 rounded-md">{userData.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editData.email || ""}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  placeholder="correo@ejemplo.com"
                />
              ) : (
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{userData.email}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editData.phone || ""}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  placeholder="+57 300 123 4567"
                />
              ) : (
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{userData.phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Document Information */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="h-5 w-5 text-primary" />
              Información de Documento
            </CardTitle>
            <CardDescription>
              Datos de identificación y rol
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Documento</Label>
              <p className="text-sm font-medium bg-muted/50 p-2 rounded-md">{userData.typeDocument}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Número de Documento</Label>
              <p className="text-sm font-medium bg-muted/50 p-2 rounded-md">{userData.numberDocument}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Cargo Asignado</Label>
              <p className="text-sm font-medium bg-muted/50 p-2 rounded-md">{userData.assignedPosition || "Sin cargo asignado"}</p>
            </div>

            <div className="space-y-2">
              <Label>Rol del Sistema</Label>
              <Badge variant="outline" className="text-sm">
                <Shield className="h-3 w-3 mr-1" />
                {userData.assignedRol || "Usuario"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Card */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
          <CardDescription>
            Detalles adicionales de tu cuenta en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">{userData.id?.slice(-6) || "N/A"}</div>
              <div className="text-sm text-muted-foreground">ID de Usuario</div>
            </div>
            <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-600">Activo</div>
              <div className="text-sm text-muted-foreground">Estado de la Cuenta</div>
            </div>
            <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-600">Admin</div>
              <div className="text-sm text-muted-foreground">Nivel de Acceso</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
