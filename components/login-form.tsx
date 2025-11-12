"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, FileText, IdCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TypeDocuments } from "@/types/types"
import Link from "next/link"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const { login, loading: authLoading } = useAuth()

  // ✅ usa un solo estado
  const [documentNumber, setDocumentNumber] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [typeDocument, setTypeDocument] = useState<TypeDocuments>(TypeDocuments.Cedula_ciudadania)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // opcional: trim
      const doc = documentNumber.trim()
      await login(doc, password, typeDocument)
      toast.success("¡Bienvenido!")
      router.push("/dashboard")
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión"
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
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Bienvenido</h1>
          <p className="text-muted-foreground text-sm text-balance max-w-xs">
            Ingresa tus credenciales para acceder al panel de administración
          </p>
        </div>

        {/* Tipo de documento */}
        <Field>
          <FieldLabel htmlFor="type-document">Tipo de documento</FieldLabel>
          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Select value={typeDocument} onValueChange={(v) => setTypeDocument(v as TypeDocuments)}>
              <SelectTrigger id="type-document" className="pl-10 h-11">
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
          <FieldDescription className="text-xs mt-1">
            Selecciona el documento con el que te registraste
          </FieldDescription>
        </Field>

        {/* Número de documento */}
        <Field>
          <FieldLabel htmlFor="documentNumber">Número de documento</FieldLabel>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="documentNumber"
              type="text"
              placeholder="2312312312"
              className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
              value={documentNumber}                // ✅ usa documentNumber
              onChange={(e) => setDocumentNumber(e.target.value)} // ✅ actualiza documentNumber
              required
              inputMode="numeric"
            />
          </div>
          <FieldDescription className="text-xs mt-1">{typeDocument}</FieldDescription>
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
              className="pl-10 pr-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {/* Olvidar contraseña */}
        <div className="text-right">
          <Link href="/olvidar-contrasena" className="text-sm text-primary hover:underline font-medium">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit */}
        <Field>
          <Button type="submit" className="w-full h-11 font-medium shadow-sm hover:shadow transition-all" disabled={loading || authLoading}>
            {loading || authLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </Field>

        <div className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-primary hover:underline font-medium">
            Regístrate
          </Link>
        </div>
      </FieldGroup>
    </form>
  )
}
