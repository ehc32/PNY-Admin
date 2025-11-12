"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { KeyRound, FileText, IdCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TypeDocuments } from "@/types/types"
import { iniciarRecuperacion } from "@/lib/api/auth-service"
import Link from "next/link"

export function OlvidarContrasenaForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()

  const [typeDocument, setTypeDocument] = useState<TypeDocuments>(TypeDocuments.Cedula_ciudadania)
  const [numberDocument, setNumberDocument] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await iniciarRecuperacion({
        typeDocument,
        numberDocument: numberDocument.trim(),
      })

      toast.success("Código enviado a tu correo electrónico")
      
      // Redirigir a la página de verificación OTP con el userId
      router.push(`/verificar-otp?userId=${response.userId}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar recuperación"
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
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">¿Olvidaste tu contraseña?</h1>
          <p className="text-muted-foreground text-sm text-balance max-w-xs">
            Ingresa tu documento para recibir un código de recuperación
          </p>
        </div>

        {/* Tipo de documento */}
        <Field>
          <FieldLabel htmlFor="type-document">Tipo de documento</FieldLabel>
          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
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
              value={numberDocument}
              onChange={(e) => setNumberDocument(e.target.value)}
              required
              inputMode="numeric"
            />
          </div>
          <FieldDescription className="text-xs mt-1">
            {typeDocument}
          </FieldDescription>
        </Field>

        {/* Submit */}
        <Field>
          <Button type="submit" className="w-full h-11 font-medium shadow-sm hover:shadow transition-all" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Enviando código...</span>
              </div>
            ) : (
              "Enviar código"
            )}
          </Button>
        </Field>

        <div className="text-center text-sm text-muted-foreground">
          ¿Recordaste tu contraseña?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Inicia sesión
          </Link>
        </div>
      </FieldGroup>
    </form>
  )
}
