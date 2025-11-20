"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User, Phone, FileText, IdCard, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TypeDocuments } from "@/types/types"
import { registrarUsuario } from "@/lib/api/auth-service"
import Link from "next/link"

export function RegistroForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    typeDocument: TypeDocuments.Cedula_ciudadania,
    numberDocument: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [registroExitoso, setRegistroExitoso] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      // Validar formato de contraseña
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/
      if (!passwordRegex.test(formData.password)) {
        throw new Error("La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial")
      }

      const { confirmPassword, ...dataToSend } = formData

      await registrarUsuario(dataToSend)
      
      setRegistroExitoso(true)
      toast.success("¡Registro exitoso!")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al registrarse"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (registroExitoso) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-2">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">¡Registro Exitoso!</h1>
          <div className="space-y-3 text-muted-foreground">
            <p className="text-base">Tu solicitud de registro ha sido recibida correctamente.</p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-foreground">⏳ Esperando aprobación</p>
              <p className="text-sm">
                Un administrador revisará tu solicitud en breve. Recibirás una notificación cuando tu cuenta sea
                aprobada.
              </p>
            </div>
            <p className="text-sm">
              Una vez aprobada, podrás iniciar sesión con tus credenciales.
            </p>
          </div>
          <Link href="/login" className="mt-4">
            <Button className="w-full">
              Volver al inicio de sesión
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
          <p className="text-muted-foreground text-sm text-balance max-w-xs">
            Completa el formulario para registrarte en el sistema
          </p>
        </div>

        {/* Nombre completo */}
        <Field>
          <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              className="pl-10 h-11"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              className="pl-10 h-11"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
        </Field>

        {/* Teléfono */}
        <Field>
          <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="phone"
              type="tel"
              placeholder="3001234567"
              className="pl-10 h-11"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>
        </Field>

        {/* Tipo de documento */}
        <Field>
          <FieldLabel htmlFor="type-document">Tipo de documento</FieldLabel>
          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
            <Select
              value={formData.typeDocument}
              onValueChange={(v) => handleChange("typeDocument", v)}
            >
              <SelectTrigger id="type-document" className="pl-10 h-11 w-full">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TypeDocuments).map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Field>

        {/* Número de documento */}
        <Field>
          <FieldLabel htmlFor="numberDocument">Número de documento</FieldLabel>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="numberDocument"
              type="text"
              placeholder="1234567890"
              className="pl-10 h-11"
              value={formData.numberDocument}
              onChange={(e) => handleChange("numberDocument", e.target.value)}
              required
              inputMode="numeric"
            />
          </div>
        </Field>

        {/* Contraseña */}
        <Field>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Debe incluir mayúscula, minúscula, número y carácter especial
            </p>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldDescription className="text-xs mt-1">
            Mínimo 6 caracteres
          </FieldDescription>
        </Field>

        {/* Confirmar contraseña */}
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirmar contraseña</FieldLabel>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {/* Submit */}
        <Field>
          <Button type="submit" className="w-full h-11 font-medium shadow-sm hover:shadow transition-all" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Registrando...</span>
              </div>
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </Field>

        <div className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Inicia sesión
          </Link>
        </div>
      </FieldGroup>
    </form>
  )
}
