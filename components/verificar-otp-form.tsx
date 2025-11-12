"use client"

import type React from "react"
import { useState, type FormEvent, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Mail, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { verificarCodigo, enviarCodigo } from "@/lib/api/auth-service"
import Link from "next/link"

export function VerificarOtpForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!userId) {
      toast.error("No se encontró el ID de usuario")
      router.push("/olvidar-contrasena")
    }
  }, [userId, router])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setLoading(true)

    try {
      const response = await verificarCodigo({
        userId,
        code: code.trim(),
      })

      if (response.isValid) {
        toast.success("Código verificado correctamente")
        router.push(`/restablecer-contrasena?userId=${userId}&code=${code.trim()}`)
      } else {
        toast.error("Código inválido o expirado")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al verificar código"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async (method: "email" | "whatsapp") => {
    if (!userId) return

    setResending(true)

    try {
      await enviarCodigo({ userId, method })
      toast.success(`Código reenviado por ${method === "email" ? "correo" : "WhatsApp"}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al reenviar código"
      toast.error(message)
    } finally {
      setResending(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Verifica tu código</h1>
          <p className="text-muted-foreground text-sm text-balance max-w-xs">
            Ingresa el código de 6 dígitos que enviamos a tu correo
          </p>
        </div>

        {/* Código OTP */}
        <Field>
          <FieldLabel htmlFor="code">Código de verificación</FieldLabel>
          <Input
            id="code"
            type="text"
            placeholder="abc123"
            className="h-11 text-center text-lg tracking-widest font-mono"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            maxLength={6}
          />
        </Field>

        {/* Submit */}
        <Field>
          <Button type="submit" className="w-full h-11 font-medium shadow-sm hover:shadow transition-all" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Verificando...</span>
              </div>
            ) : (
              "Verificar código"
            )}
          </Button>
        </Field>

        {/* Reenviar código */}
        <div className="space-y-2">
          <p className="text-center text-sm text-muted-foreground">¿No recibiste el código?</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10"
              onClick={() => handleResendCode("email")}
              disabled={resending}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10"
              onClick={() => handleResendCode("whatsapp")}
              disabled={resending}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/olvidar-contrasena" className="text-primary hover:underline font-medium">
            Volver atrás
          </Link>
        </div>
      </FieldGroup>
    </form>
  )
}
