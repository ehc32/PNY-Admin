"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { getRoles, type Rol } from "@/lib/api/users-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TypeDocuments } from "@/types/types"
import { ArrowLeft, UserPlus, User, Mail, Phone, FileText, Lock, Settings, Upload, X, Camera } from "lucide-react"
import Link from "next/link"

const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export default function AddUserPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [roles, setRoles] = useState<Rol[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    typeDocument: TypeDocuments.Cedula_ciudadania,
    numberDocument: "",
    password: "",
    confirmPassword: "",
    photoUrl: "",
    assignedRol: "",
    state: true,
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>("")

  useEffect(() => {
    const fetchRoles = async () => {
      if (!token) return
      try {
        const rolesData = await getRoles(token)
        setRoles(rolesData)
      } catch (error) {
        toast.error("Error al cargar roles")
      }
    }
    fetchRoles()
  }, [token])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validación de tamaño máximo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar 5MB")
        return
      }

      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview("")
    // Reset file input
    const fileInput = document.getElementById('photo') as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/
    if (!passwordRegex.test(formData.password)) {
      toast.error("La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial")
      return
    }


    setIsLoading(true)

    try {
      const { confirmPassword, ...dataToSend } = formData

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Error al crear usuario")
      }

      toast.success("Usuario creado exitosamente")
      router.push("/users/control")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear usuario")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users/control">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agregar Usuario</h1>
          <p className="text-sm text-muted-foreground">Crea un nuevo usuario en el sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección 1: Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>Datos básicos y foto de perfil del usuario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Foto de Perfil - Grande y destacada */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-muted/30 border-2 border-dashed border-border/50">
              <div className="relative">
                {photoPreview ? (
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg ring-2 ring-primary/20">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleRemovePhoto}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted border-4 border-background shadow-lg flex items-center justify-center">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {photoPreview ? "Cambiar foto" : "Subir foto de perfil"}
                    </span>
                  </div>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </Label>
                <p className="text-xs text-muted-foreground text-center">
                  JPG, PNG o GIF (máx. 5MB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nombre completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Juan Pérez García"
                  required
                  className="h-11"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Correo electrónico <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="usuario@sena.edu.co"
                  required
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">Debe ser un Domionio Correcto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 2: Contacto y Documentación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Contacto y Documentación
            </CardTitle>
            <CardDescription>Información de contacto y documentos de identificación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="3001234567"
                  required
                  className="h-11"
                />
              </div>

              {/* Tipo de documento */}
              <div className="space-y-2">
                <Label htmlFor="typeDocument">
                  Tipo de documento <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.typeDocument} onValueChange={(v) => handleChange("typeDocument", v)}>
                  <SelectTrigger id="typeDocument" className="pl-10 h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TypeDocuments).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Número de documento */}
              <div className="space-y-2">
                <Label htmlFor="numberDocument">
                  Número de documento <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="numberDocument"
                  value={formData.numberDocument}
                  onChange={(e) => handleChange("numberDocument", e.target.value)}
                  placeholder="1234567890"
                  required
                  inputMode="numeric"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección 3: Configuración de Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Configuración de Cuenta
            </CardTitle>
            <CardDescription>Configuración de acceso y permisos del usuario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rol */}
              <div className="space-y-2">
                <Label htmlFor="assignedRol">Rol asignado</Label>
                <Select
                  value={formData.assignedRol || "none"}
                  onValueChange={(v) => handleChange("assignedRol", v === "none" ? "" : v)}
                >
                  <SelectTrigger id="assignedRol" className="pl-10 h-11 w-full">
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

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="state">Estado inicial</Label>
                <Select value={formData.state.toString()} onValueChange={(v) => handleChange("state", v === "true")}>
                  <SelectTrigger id="state" className="-pl-10 h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Contraseña <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres, incluir mayúscula, minúscula, número y carácter especial
                </p>
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Confirmar contraseña <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <Link href="/users/control">
            <Button type="button" variant="outline" size="lg">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading} size="lg" className="min-w-[150px]">
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Creando...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Crear Usuario
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
