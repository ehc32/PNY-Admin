"use client"

import { useState, useEffect } from "react"
import { Settings2, ArrowLeft, Save, TestTube, Mail, MessageSquare, Phone, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { obtenerConfiguracion, crearConfiguracion, actualizarConfiguracion, eliminarConfiguracion, probarConfigEmail, probarConfigSMS, type SystemConfig } from "@/lib/api/config-service"
import { GenericTable } from "@/components/generic-table"
import { toast } from "sonner"

export default function ConfiguracionSistemaPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState({ email: false, sms: false, wss: false })
  const [configuraciones, setConfiguraciones] = useState<SystemConfig[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null)
  const [config, setConfig] = useState<SystemConfig>({
    emailConfig: {
      host: "",
      user: "",
      password: "",
      defaults: "",
    },
    smsConfig: {
      url: "",
      apiKey: "",
      number: "",
    },
    wssConfig: {
      hostname: "",
      apiKey: "",
      fromNumber: "",
    },
  })

  useEffect(() => {
    if (token) {
      cargarConfiguraciones()
    }
  }, [token])

  const cargarConfiguraciones = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const data = await obtenerConfiguracion(token)
      // Si obtenerConfiguracion devuelve una sola configuración, la convertimos en array
      setConfiguraciones(Array.isArray(data) ? data : [data])
    } catch (error) {
      console.error("Error al cargar configuraciones:", error)
      setConfiguraciones([])
    } finally {
      setLoading(false)
    }
  }

  const handleNuevaConfig = () => {
    setEditingConfig(null)
    setConfig({
      emailConfig: { host: "", user: "", password: "", defaults: "" },
      smsConfig: { url: "", apiKey: "", number: "" },
      wssConfig: { hostname: "", apiKey: "", fromNumber: "" },
    })
    setShowForm(true)
  }

  const handleEditConfig = (configToEdit: SystemConfig) => {
    setEditingConfig(configToEdit)
    setConfig(configToEdit)
    setShowForm(true)
  }

  const handleEliminarConfig = async (id: string) => {
    if (!token) return
    
    if (!confirm("¿Estás seguro de que deseas eliminar esta configuración?")) return
    
    try {
      await eliminarConfiguracion(token)
      toast.success("Configuración eliminada correctamente")
      cargarConfiguraciones()
    } catch (error) {
      console.error("Error al eliminar configuración:", error)
      toast.error("Error al eliminar la configuración")
    }
  }

  const handleSave = async () => {
    if (!token) return

    setSaving(true)
    try {
      if (editingConfig && editingConfig._id) {
        await actualizarConfiguracion(token, config)
        toast.success("Configuración actualizada correctamente")
      } else {
        await crearConfiguracion(token, config)
        toast.success("Configuración creada correctamente")
      }
      
      setShowForm(false)
      cargarConfiguraciones()
    } catch (error) {
      console.error("Error al guardar configuración:", error)
      const message = error instanceof Error ? error.message : "Error al guardar configuración"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    if (!token) return

    setTesting(prev => ({ ...prev, email: true }))
    try {
      const result = await probarConfigEmail(token, config.emailConfig)
      if (result.success) {
        toast.success("Configuración de email válida")
      } else {
        toast.error(result.message || "Error en la configuración de email")
      }
    } catch (error) {
      console.error("Error al probar email:", error)
      toast.error("Error al probar configuración de email")
    } finally {
      setTesting(prev => ({ ...prev, email: false }))
    }
  }

  const handleTestSMS = async () => {
    if (!token) return

    setTesting(prev => ({ ...prev, sms: true }))
    try {
      const result = await probarConfigSMS(token, config.smsConfig)
      if (result.success) {
        toast.success("Configuración de SMS válida")
      } else {
        toast.error(result.message || "Error en la configuración de SMS")
      }
    } catch (error) {
      console.error("Error al probar SMS:", error)
      toast.error("Error al probar configuración de SMS")
    } finally {
      setTesting(prev => ({ ...prev, sms: false }))
    }
  }

  const updateEmailConfig = (field: keyof SystemConfig['emailConfig'], value: string) => {
    setConfig(prev => ({
      ...prev,
      emailConfig: {
        ...(prev.emailConfig || {
          host: "",
          user: "",
          password: "",
          defaults: "",
        }),
        [field]: value,
      },
    }))
  }

  const updateSmsConfig = (field: keyof SystemConfig['smsConfig'], value: string) => {
    setConfig(prev => ({
      ...prev,
      smsConfig: {
        ...(prev.smsConfig || {
          url: "",
          apiKey: "",
          number: "",
        }),
        [field]: value,
      },
    }))
  }

  const updateWssConfig = (field: keyof SystemConfig['wssConfig'], value: string) => {
    setConfig(prev => ({
      ...prev,
      wssConfig: {
        ...(prev.wssConfig || {
          hostname: "",
          apiKey: "",
          fromNumber: "",
        }),
        [field]: value,
      },
    }))
  }

  const columns = [
    {
      id: "emailConfig",
      label: "Email",
      accessor: "emailConfig" as keyof SystemConfig,
      render: (value: any, config: SystemConfig) => (
        <div className="text-sm">
          <div className="font-medium">{config.emailConfig?.host || "No configurado"}</div>
          <div className="text-muted-foreground">{config.emailConfig?.user || ""}</div>
        </div>
      )
    },
    {
      id: "smsConfig",
      label: "SMS",
      accessor: "smsConfig" as keyof SystemConfig,
      render: (value: any, config: SystemConfig) => (
        <div className="text-sm">
          <div className="font-medium">{config.smsConfig?.url || "No configurado"}</div>
          <div className="text-muted-foreground">{config.smsConfig?.number || ""}</div>
        </div>
      )
    },
    {
      id: "wssConfig",
      label: "WhatsApp",
      accessor: "wssConfig" as keyof SystemConfig,
      render: (value: any, config: SystemConfig) => (
        <div className="text-sm">
          <div className="font-medium">{config.wssConfig?.hostname || "No configurado"}</div>
          <div className="text-muted-foreground">{config.wssConfig?.fromNumber || ""}</div>
        </div>
      )
    },
    {
      id: "createdAt",
      label: "Fecha de Creación",
      accessor: "createdAt" as keyof SystemConfig,
      render: (value: any, config: SystemConfig) => (
        config.createdAt ? new Date(config.createdAt).toLocaleDateString("es-ES") : "N/A"
      )
    },
    {
      id: "actions",
      label: "Acciones",
      accessor: "_id" as keyof SystemConfig,
      render: (value: any, config: SystemConfig) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditConfig(config)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEliminarConfig(config._id!)}
            className="text-destructive hover:text-destructive"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/configuracion">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Settings2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
              <p className="text-muted-foreground">Configura los servicios de comunicación</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {showForm && (
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          )}
          {showForm ? (
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Guardando..." : editingConfig ? "Actualizar" : "Crear"}
            </Button>
          ) : (
            <Button onClick={handleNuevaConfig}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Configuración
            </Button>
          )}
        </div>
      </div>

      {!showForm ? (
        /* Tabla de configuraciones */
        <Card>
          <CardHeader>
            <CardTitle>Configuraciones del Sistema</CardTitle>
            <CardDescription>
              Lista de todas las configuraciones de servicios de comunicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={configuraciones}
              columns={columns}
              isLoading={loading}
              showActions={false}
            />
          </CardContent>
        </Card>
      ) : (
        /* Formulario de configuración */
        <Card>
          <CardHeader>
            <CardTitle>
              {editingConfig ? "Editar Configuración" : "Nueva Configuración"}
            </CardTitle>
            <CardDescription>
              Configura los parámetros para email, SMS y WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
            </TabsList>

            {/* Configuración Email */}
            <TabsContent value="email" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email-host">Host del Servidor</Label>
                  <Input
                    id="email-host"
                    value={config.emailConfig?.host || ""}
                    onChange={(e) => updateEmailConfig("host", e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-user">Usuario</Label>
                  <Input
                    id="email-user"
                    value={config.emailConfig?.user || ""}
                    onChange={(e) => updateEmailConfig("user", e.target.value)}
                    placeholder="usuario@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-password">Contraseña</Label>
                  <Input
                    id="email-password"
                    type="password"
                    value={config.emailConfig?.password || ""}
                    onChange={(e) => updateEmailConfig("password", e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-defaults">Configuración por Defecto</Label>
                  <Input
                    id="email-defaults"
                    value={config.emailConfig?.defaults || ""}
                    onChange={(e) => updateEmailConfig("defaults", e.target.value)}
                    placeholder="Remitente por defecto"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={handleTestEmail} disabled={testing.email}>
                  <TestTube className="h-4 w-4 mr-2" />
                  {testing.email ? "Probando..." : "Probar Configuración"}
                </Button>
              </div>
            </TabsContent>

            {/* Configuración SMS */}
            <TabsContent value="sms" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sms-url">URL del Servicio</Label>
                  <Input
                    id="sms-url"
                    value={config.smsConfig?.url || ""}
                    onChange={(e) => updateSmsConfig("url", e.target.value)}
                    placeholder="https://api.sms-service.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-apikey">API Key</Label>
                  <Input
                    id="sms-apikey"
                    type="password"
                    value={config.smsConfig?.apiKey || ""}
                    onChange={(e) => updateSmsConfig("apiKey", e.target.value)}
                    placeholder="••••••••••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-number">Número Remitente</Label>
                  <Input
                    id="sms-number"
                    value={config.smsConfig?.number || ""}
                    onChange={(e) => updateSmsConfig("number", e.target.value)}
                    placeholder="+573001234567"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={handleTestSMS} disabled={testing.sms}>
                  <TestTube className="h-4 w-4 mr-2" />
                  {testing.sms ? "Probando..." : "Probar Configuración"}
                </Button>
              </div>
            </TabsContent>

            {/* Configuración WhatsApp */}
            <TabsContent value="whatsapp" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wss-hostname">Hostname</Label>
                  <Input
                    id="wss-hostname"
                    value={config.wssConfig?.hostname || ""}
                    onChange={(e) => updateWssConfig("hostname", e.target.value)}
                    placeholder="api.whatsapp.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wss-apikey">API Key</Label>
                  <Input
                    id="wss-apikey"
                    type="password"
                    value={config.wssConfig?.apiKey || ""}
                    onChange={(e) => updateWssConfig("apiKey", e.target.value)}
                    placeholder="••••••••••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wss-fromnumber">Número Remitente</Label>
                  <Input
                    id="wss-fromnumber"
                    value={config.wssConfig?.fromNumber || ""}
                    onChange={(e) => updateWssConfig("fromNumber", e.target.value)}
                    placeholder="+573001234567"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" disabled>
                  <TestTube className="h-4 w-4 mr-2" />
                  Probar Configuración
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
