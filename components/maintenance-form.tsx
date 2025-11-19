"use client"

import { useState } from "react"
import { CheckCircle2, ClipboardList, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

const API_URL = "https://stingray-app-e496q.ondigitalocean.app/application-maintenance"

const maintenanceTypes = ["Preventivo", "Correctivo", "Predictivo", "Emergencia"]

const initialForm = {
  requesterName: "",
  requesterPhone: "",
  serialNumber: "",
  InventoryCode: "",
  maintenanceType: "",
  issueDescription: "",
}

export default function MaintenanceForm() {
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTrackingNumber(null)

    const hasEmptyField = Object.entries(formData).some(([key, value]) => {
      if (key === "issueDescription") return value.trim().length === 0
      return value === ""
    })

    if (hasEmptyField) {
      toast.error("Completa todos los campos requeridos antes de enviar la orden")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...formData }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || "No se pudo crear la orden de mantenimiento")
      }

      const data = await response.json().catch(() => ({}))
      const tracking = data.trackingNumber || "En seguimiento"
      setTrackingNumber(tracking)
      toast.success("Orden de mantenimiento creada")
      setFormData(initialForm)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al registrar la orden")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-emerald-50/60 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white shadow-2xl border border-emerald-100/80 p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-700 font-semibold">Solicitud en línea</p>
              <h2 className="text-3xl font-bold text-slate-900">Realiza tu solicitud de mantenimiento</h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Integramos la API oficial para generar una orden con número de seguimiento y mantenerte informado del proceso.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-emerald-800">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">Datos protegidos y trazables</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800" htmlFor="requesterName">
                  Nombre del solicitante
                </label>
                <input
                  id="requesterName"
                  name="requesterName"
                  value={formData.requesterName}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  className="w-full rounded-lg border border-emerald-100 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800" htmlFor="requesterPhone">
                  Número de teléfono
                </label>
                <input
                  id="requesterPhone"
                  name="requesterPhone"
                  type="tel"
                  value={formData.requesterPhone}
                  onChange={handleChange}
                  placeholder="Número de contacto"
                  className="w-full rounded-lg border border-emerald-100 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800" htmlFor="serialNumber">
                  Número de serie
                </label>
                <input
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Serie del equipo"
                  className="w-full rounded-lg border border-emerald-100 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-[1.3fr_0.7fr] gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800" htmlFor="issueDescription">
                  Descripción de la falla
                </label>
                <textarea
                  id="issueDescription"
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleChange}
                  placeholder="Describe detalladamente la falla presentada"
                  rows={5}
                  className="w-full rounded-lg border border-emerald-100 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none"
                  maxLength={500}
                  required
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.issueDescription.length}/500 caracteres
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800" htmlFor="InventoryCode">
                    Código inventario
                  </label>
                  <input
                    id="InventoryCode"
                    name="InventoryCode"
                    value={formData.InventoryCode}
                    onChange={handleChange}
                    placeholder="Ej. INV-00123"
                    className="w-full rounded-lg border border-emerald-100 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800" htmlFor="maintenanceType">
                    Tipo de mantenimiento
                  </label>
                  <select
                    id="maintenanceType"
                    name="maintenanceType"
                    value={formData.maintenanceType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-emerald-100 px-4 py-3 text-base shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
                    required
                  >
                    <option value="">Selecciona el tipo</option>
                    {maintenanceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <ClipboardList className="h-4 w-4" />
                <span>Recibirás un número de seguimiento al crear la orden.</span>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-6 py-3 text-white font-semibold shadow-lg transition-all hover:bg-emerald-800 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando solicitud
                  </>
                ) : (
                  "Enviar solicitud"
                )}
              </button>
            </div>
          </form>

          {trackingNumber && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900 shadow-sm flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Orden creada correctamente</p>
                <p className="text-sm">Tu número de seguimiento es: <span className="font-mono">{trackingNumber}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
