"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { getRoles, type Rol } from "@/lib/api/users-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TypeDocuments } from "@/types/types"
import { ArrowLeft, UserPlus } from "lucide-react"
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
    assignedPosition: "",
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
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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

    if (!formData.email.match(/@(soy\.sena\.edu\.co|sena\.edu\.co)$/i)) {
      toast.error("El correo debe pertenecer al dominio @soy.sena.edu.co o @sena.edu.co")
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-8">
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4 lg:px-0">
        <div className="flex items-center gap-3">
          <Link href="/users/control">
            <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">Gestión de usuarios</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Nuevo usuario interno</h1>
            <p className="text-sm text-muted-foreground">
              Completa el formulario con el estilo institucional para registrar un nuevo miembro.
            </p>
          </div>
        </div>

        <Card className="border-emerald-100/80 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
                  <UserPlus className="h-5 w-5 text-emerald-700" />
                  Datos principales
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Organizamos el formulario en bloques claros para facilitar el registro y mantener consistencia visual.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                Diseño renovado
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                <p className="text-xs font-semibold text-emerald-800">Accesos seguros</p>
                <p className="text-sm text-emerald-900/80 mt-1">
                  Dominios oficiales @sena garantizan identidad y trazabilidad.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-emerald-800">Roles claros</p>
                <p className="text-sm text-slate-700 mt-1">Asigna permisos y posiciones desde el inicio.</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-emerald-800">Estado inicial</p>
                <p className="text-sm text-slate-700 mt-1">Activa el usuario o déjalo pendiente hasta aprobación.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">Datos personales</h2>
                      <Badge variant="outline" className="border-emerald-200 text-emerald-800">
                        Requeridos
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Nombre completo <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Nombre y apellidos"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Correo institucional <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="usuario@sena.edu.co"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Dominios permitidos: @sena.edu.co o @soy.sena.edu.co</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Teléfono <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="573001234567"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="typeDocument">
                          Tipo de documento <span className="text-destructive">*</span>
                        </Label>
                        <Select value={formData.typeDocument} onValueChange={(v) => handleChange("typeDocument", v)}>
                          <SelectTrigger id="typeDocument">
                            <SelectValue placeholder="Selecciona un tipo" />
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
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="photo">Foto de perfil</Label>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <Input
                              id="photo"
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Opcional - JPG o PNG, máximo 5MB.
                            </p>
                          </div>
                          {photoPreview && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-emerald-100 shadow-sm">
                              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">Credenciales y estado</h2>
                      <Badge variant="outline" className="border-emerald-200 text-emerald-800">
                        Seguridad
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">
                          Contraseña <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Debe incluir mayúsculas, minúsculas, números y caracteres especiales.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirmar contraseña <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange("confirmPassword", e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado inicial</Label>
                        <Select value={formData.state.toString()} onValueChange={(v) => handleChange("state", v === "true")}>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Selecciona estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Activo</SelectItem>
                            <SelectItem value="false">Pendiente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">Rol y posición</h2>
                      <Badge variant="outline" className="border-emerald-200 text-emerald-800">
                        Organización
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="assignedRol">Rol asignado</Label>
                        <Select
                          value={formData.assignedRol || "none"}
                          onValueChange={(v) => handleChange("assignedRol", v === "none" ? "" : v)}
                        >
                          <SelectTrigger id="assignedRol">
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
                        <Label htmlFor="assignedPosition">Posición</Label>
                        <Select
                          value={formData.assignedPosition || "none"}
                          onValueChange={(v) => handleChange("assignedPosition", v === "none" ? "" : v)}
                        >
                          <SelectTrigger id="assignedPosition">
                            <SelectValue placeholder="Selecciona una posición" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sin posición</SelectItem>
                            <SelectItem value="Contratista">Contratista</SelectItem>
                            <SelectItem value="Planta">Planta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4 text-sm text-emerald-900">
                        Vincula las responsabilidades y permisos desde el inicio para evitar reprocesos de seguridad.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-end pt-2 border-t border-emerald-100/80 sm:flex-row">
                <Link href="/users/control">
                  <Button type="button" variant="outline" className="bg-white">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isLoading} className="bg-emerald-700 hover:bg-emerald-800">
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Crear usuario
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
