"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, FileText, Award as IdCard, ArrowRight } from 'lucide-react'
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

  const [documentNumber, setDocumentNumber] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [typeDocument, setTypeDocument] = useState<TypeDocuments>(TypeDocuments.Cedula_ciudadania)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
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
        <Field>
          <FieldLabel htmlFor="type-document" className="text-sm font-semibold text-gray-900 mb-2">
            Tipo de documento
          </FieldLabel>
          <div className="relative">
            <Select value={typeDocument} onValueChange={(v) => setTypeDocument(v as TypeDocuments)}>
              <SelectTrigger 
                id="type-document" 
                className="h-12 border border-gray-300 rounded-xl bg-white text-gray-900 hover:border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
              >
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

        <Field>
          <FieldLabel htmlFor="documentNumber" className="text-sm font-semibold text-gray-900 mb-2">
            Número de documento
          </FieldLabel>
          <div className="relative">
            <FileText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Input
              id="documentNumber"
              type="text"
              placeholder="Ingresa tu número de documento"
              className="pl-12 h-12 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 hover:border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              required
              inputMode="numeric"
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="password" className="text-sm font-semibold text-gray-900 mb-2">
            Contraseña
          </FieldLabel>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              className="pl-12 pr-12 h-12 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 hover:border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors p-1"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <input 
            type="checkbox" 
            id="remember" 
            className="w-4 h-4 rounded border-2 border-gray-300 bg-white cursor-pointer accent-teal-600 focus:ring-2 focus:ring-teal-500/20"
          />
          <label htmlFor="remember" className="text-sm text-gray-700 font-medium cursor-pointer">
            Recordar mis credenciales
          </label>
        </div>

        <Field>
          <Button 
            type="submit" 
            className="w-full h-12 font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none mt-4 text-base"
            disabled={loading || authLoading}
          >
            {loading || authLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 justify-center">
                <span>Continuar</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Button>
        </Field>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link 
            href="/olvidar-contrasena" 
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Link 
            href="/registro" 
            className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors hover:underline"
          >
            Crear cuenta
          </Link>
        </div>
      </FieldGroup>
    </form>
  )
}
