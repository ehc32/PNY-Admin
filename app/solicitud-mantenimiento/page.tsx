"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, CheckCircle2, Database, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export default function SolicitudMantenimientoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")

  const [formData, setFormData] = useState({
    requesterName: "",
    requesterPhone: "",
    serialNumber: "",
    maintenanceType: "",
    InventoryCode: "",
    issueDescription: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/application-maintenance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "Error al enviar la solicitud")
      }

      const data = await response.json()
      setTrackingNumber(data.trackingNumber || "N/A")
      setIsSuccess(true)
      toast.success("Solicitud enviada exitosamente")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al enviar la solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#52B12C]/5 via-background to-[#52B12C]/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#52B12C]/20 shadow-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-[#52B12C]/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-[#52B12C]" />
            </div>
            <div>
              <CardTitle className="text-2xl text-[#52B12C]">¡Solicitud Enviada!</CardTitle>
              <CardDescription className="mt-2">Tu solicitud ha sido registrada exitosamente</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-[#52B12C]/5 rounded-lg p-4 border border-[#52B12C]/20">
              <p className="text-sm text-muted-foreground mb-2">Número de seguimiento:</p>
              <p className="text-2xl font-bold text-[#52B12C] font-mono">{trackingNumber}</p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Guarda este número para consultar el estado de tu solicitud</p>
              <p>✓ Recibirás notificaciones sobre el progreso del mantenimiento</p>
              <p>✓ El tiempo de respuesta estimado es de 24-48 horas</p>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={() => {
                  setIsSuccess(false)
                  setFormData({
                    requesterName: "",
                    requesterPhone: "",
                    serialNumber: "",
                    maintenanceType: "",
                    InventoryCode: "",
                    issueDescription: "",
                  })
                }}
                className="w-full bg-[#52B12C] hover:bg-[#52B12C]/90"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Nueva Solicitud
              </Button>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full border-[#52B12C]/20 hover:bg-[#52B12C]/5">
                  Ir al Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#52B12C]/5 via-background to-[#52B12C]/5">
      {/* Header */}
      <header className="border-b border-[#52B12C]/10 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image src="/LOGO-1.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#52B12C]">Sistema de Gestión de Inventarios</h1>
              <p className="text-xs text-muted-foreground">Regional Huila</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-[#52B12C]/20 hover:bg-[#52B12C]/5">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-10 space-y-4 py-8">
          <div className="inline-block px-4 py-1.5 bg-[#52B12C]/10 rounded-full border border-[#52B12C]/20 mb-2">
            <span className="text-sm font-medium text-[#52B12C]">Sistema de Gestión de Inventarios</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Bienvenidos al sistema de gestión de inventarios de la regional Huila
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Realiza tu solicitud de mantenimiento de forma rápida y sencilla. Completa el formulario y recibe un
            número de seguimiento para rastrear tu solicitud.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="border-[#52B12C]/20 hover:border-[#52B12C] hover:shadow-lg hover:shadow-[#52B12C]/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="pt-8 pb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#52B12C]/20 to-[#52B12C]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-10 w-10 text-[#52B12C]" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-[#52B12C]">Consulta de bienes registrados</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Accede al inventario completo de equipos y recursos disponibles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#52B12C]/20 hover:border-[#52B12C] hover:shadow-lg hover:shadow-[#52B12C]/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="pt-8 pb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#52B12C]/20 to-[#52B12C]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-10 w-10 text-[#52B12C]" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-[#52B12C]">Consulta el estado de tu solicitud</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Rastrea tu solicitud en tiempo real con el número de seguimiento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Card */}
        <Card className="border-[#52B12C]/30 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#52B12C]/10 via-[#52B12C]/5 to-transparent border-b-2 border-[#52B12C]/20 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#52B12C] to-[#52B12C]/80 flex items-center justify-center shadow-lg shadow-[#52B12C]/30">
                <Wrench className="h-7 w-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-[#52B12C] mb-1">Realiza tu solicitud de mantenimiento</CardTitle>
                <CardDescription className="text-base">
                  Completa todos los campos para registrar tu solicitud de forma segura
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-8 px-6 md:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sección: Información del Solicitante */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#52B12C]/20">
                  <div className="w-8 h-8 rounded-lg bg-[#52B12C]/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#52B12C]">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Información del Solicitante</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Nombre del solicitante */}
                  <div className="space-y-2">
                    <Label htmlFor="requesterName" className="text-foreground font-medium">
                      Nombre del solicitante <span className="text-[#52B12C]">*</span>
                    </Label>
                    <Input
                      id="requesterName"
                      value={formData.requesterName}
                      onChange={(e) => handleChange("requesterName", e.target.value)}
                      placeholder="Nombre completo"
                      required
                      className="border-[#52B12C]/30 focus:border-[#52B12C] focus:ring-[#52B12C] h-11"
                    />
                  </div>

                  {/* Número de teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="requesterPhone" className="text-foreground font-medium">
                      Número de teléfono <span className="text-[#52B12C]">*</span>
                    </Label>
                    <Input
                      id="requesterPhone"
                      type="tel"
                      value={formData.requesterPhone}
                      onChange={(e) => handleChange("requesterPhone", e.target.value)}
                      placeholder="Número de teléfono"
                      required
                      className="border-[#52B12C]/30 focus:border-[#52B12C] focus:ring-[#52B12C] h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Información del Equipo */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#52B12C]/20">
                  <div className="w-8 h-8 rounded-lg bg-[#52B12C]/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#52B12C]">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Información del Equipo</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Número de serie */}
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber" className="text-foreground font-medium">
                      Número de serie <span className="text-[#52B12C]">*</span>
                    </Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => handleChange("serialNumber", e.target.value)}
                      placeholder="Número de serie del equipo"
                      required
                      className="border-[#52B12C]/30 focus:border-[#52B12C] focus:ring-[#52B12C] h-11"
                    />
                  </div>

                  {/* Código de inventario */}
                  <div className="space-y-2">
                    <Label htmlFor="InventoryCode" className="text-foreground font-medium">
                      Código de inventario <span className="text-[#52B12C]">*</span>
                    </Label>
                    <Input
                      id="InventoryCode"
                      value={formData.InventoryCode}
                      onChange={(e) => handleChange("InventoryCode", e.target.value)}
                      placeholder="Código de inventario"
                      required
                      className="border-[#52B12C]/30 focus:border-[#52B12C] focus:ring-[#52B12C] h-11"
                    />
                  </div>

                  {/* Tipo de mantenimiento */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="maintenanceType" className="text-foreground font-medium">
                      Tipo de mantenimiento <span className="text-[#52B12C]">*</span>
                    </Label>
                    <Select value={formData.maintenanceType} onValueChange={(v) => handleChange("maintenanceType", v)} required>
                      <SelectTrigger id="maintenanceType" className="border-[#52B12C]/30 focus:border-[#52B12C] focus:ring-[#52B12C] h-11">
                        <SelectValue placeholder="Selecciona el tipo de mantenimiento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preventivo">🛡️ Preventivo - Mantenimiento programado</SelectItem>
                        <SelectItem value="Correctivo">🔧 Correctivo - Reparación de fallas</SelectItem>
                        <SelectItem value="Predictivo">📊 Predictivo - Basado en análisis</SelectItem>
                        <SelectItem value="Emergencia">🚨 Emergencia - Atención urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Sección: Descripción del Problema */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#52B12C]/20">
                  <div className="w-8 h-8 rounded-lg bg-[#52B12C]/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#52B12C]">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Descripción del Problema</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDescription" className="text-foreground font-medium">
                    Descripción detallada de la falla o solicitud <span className="text-[#52B12C]">*</span>
                  </Label>
                  <Textarea
                    id="issueDescription"
                    value={formData.issueDescription}
                    onChange={(e) => handleChange("issueDescription", e.target.value)}
                    placeholder="Describe detalladamente la falla, el problema o el motivo de tu solicitud. Incluye síntomas, cuándo comenzó el problema y cualquier información relevante..."
                    required
                    rows={5}
                    maxLength={500}
                    className="border-[#52B12C]/30 focus:border-[#52B12C] focus:ring-[#52B12C] resize-none"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Sé lo más específico posible</span>
                    <span className={`font-medium ${formData.issueDescription.length > 450 ? 'text-[#52B12C]' : 'text-muted-foreground'}`}>
                      {formData.issueDescription.length}/500 caracteres
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-[#52B12C]/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      requesterName: "",
                      requesterPhone: "",
                      serialNumber: "",
                      maintenanceType: "",
                      InventoryCode: "",
                      issueDescription: "",
                    })
                  }}
                  className="border-[#52B12C]/30 hover:bg-[#52B12C]/5"
                  size="lg"
                >
                  Limpiar formulario
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#52B12C] to-[#52B12C]/90 hover:from-[#52B12C]/90 hover:to-[#52B12C]/80 text-white px-10 shadow-lg shadow-[#52B12C]/30"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Enviando solicitud...
                    </>
                  ) : (
                    <>
                      <Wrench className="h-5 w-5 mr-2" />
                      Enviar solicitud
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Centro de la Empresa la Industria y los Servicios</p>
          <p className="mt-1">Calle 9 No 10-60 Barrio PRIMAVERA / NEIVA / HUILA / IP-47001</p>
        </div>
      </main>
    </div>
  )
}
