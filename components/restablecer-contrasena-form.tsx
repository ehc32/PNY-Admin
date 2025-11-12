"use client"

import type React from "react"
import { useState, type FormEvent, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { resetearPassword } from "@/lib/api/auth-service"

export function RestablecerContrasenaForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const code = searchParams.get("code")

  const [nuevaContrasena, setNuevaContrasena] = useState("")
  const [confirmarContrasena, setConfirmarContrasena] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId || !code) {
      toast.error("Datos de recuperación inválidos")
      router.push("/olvidar-contrasena")
    }
  }, [userId, code, router])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!userId || !code) return

    setLoading(true)

    try {
      // Validaciones
      if (nuevaContrasena !== confirmarContrasena) {
        toast.error("Las contraseñas no coinciden")
        return
      }

      // Validar formato de contraseña
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/
      if (!passwordRegex.test(nuevaContrasena)) {
        toast.error("La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial")
        return
      }

      await resetearPassword({
        userId,
        code,
        nuevaContrasena,
      })

      toast.success("Contraseña actualizada correctamente")
      router.push("/login")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al restablecer contraseña"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Nueva contraseña</h1>
          <p className="text-muted-foreground text-sm text-balance max-w-xs">
            Crea una contraseña segura para tu cuenta
          </p>
        </div>

        {/* Nueva contraseña */}
        <Field>
          <FieldLabel htmlFor="nuevaContrasena">Nueva contraseña</FieldLabel>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="nuevaContrasena"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              required
            />
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
          <FieldLabel htmlFor="confirmarContrasena">Confirmar contraseña</FieldLabel>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="confirmarContrasena"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
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
                <span>Actualizando...</span>
              </div>
            ) : (
              "Restablecer contraseña"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
