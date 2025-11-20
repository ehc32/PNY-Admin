"use client"

import { useState } from "react"
import { Camera, CirclePlus, Warehouse } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialAsset = {
  name: "",
  ubicacion: "",
  ambiente: "",
  fechaIngreso: "",
  centroFormacion: "",
  categoria: "",
  numeroSerie: "",
  estado: "",
  encargado: "",
  fabricanteNombre: "",
  fabricanteDireccion: "",
  fabricanteTelefono: "",
  proveedorNombre: "",
  proveedorDireccion: "",
  proveedorTelefono: "",
}

export default function AssetForm() {
  const [assetData, setAssetData] = useState(initialAsset)
  const [feature, setFeature] = useState("")
  const [features, setFeatures] = useState<string[]>([])

  const handleChange = (field: keyof typeof initialAsset, value: string) => {
    setAssetData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureAdd = () => {
    const clean = feature.trim()
    if (!clean) return
    if (features.includes(clean)) return
    setFeatures((prev) => [...prev, clean])
    setFeature("")
  }

  const handleFeatureRemove = (item: string) => {
    setFeatures((prev) => prev.filter((feat) => feat !== item))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success("Formulario de bien registrado de manera local (diseño listo para integración)")
    setAssetData(initialAsset)
    setFeatures([])
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 text-emerald-800">
          <Warehouse className="h-5 w-5" />
          <p className="text-sm font-semibold uppercase tracking-wide">Registro de bienes</p>
        </div>

        <Card className="border-emerald-100 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-slate-900">Crear bien o activo</CardTitle>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                Diseño institucional
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Datos del equipo</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                          id="name"
                          value={assetData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Lenovo Thinkpad"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="centroFormacion">Centro de formación</Label>
                        <Input
                          id="centroFormacion"
                          value={assetData.centroFormacion}
                          onChange={(e) => handleChange("centroFormacion", e.target.value)}
                          placeholder="CIES"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ubicacion">Ubicación</Label>
                        <Input
                          id="ubicacion"
                          value={assetData.ubicacion}
                          onChange={(e) => handleChange("ubicacion", e.target.value)}
                          placeholder="Sala de sistemas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoria">Categoría</Label>
                        <div className="flex gap-2">
                          <Input
                            id="categoria"
                            value={assetData.categoria}
                            onChange={(e) => handleChange("categoria", e.target.value)}
                            placeholder="Cómputo"
                          />
                          <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={handleFeatureAdd}>
                            <CirclePlus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ambiente">Ambiente</Label>
                        <Input
                          id="ambiente"
                          value={assetData.ambiente}
                          onChange={(e) => handleChange("ambiente", e.target.value)}
                          placeholder="Aula 212"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fechaIngreso">Fecha de ingreso</Label>
                        <Input
                          id="fechaIngreso"
                          type="date"
                          value={assetData.fechaIngreso}
                          onChange={(e) => handleChange("fechaIngreso", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numeroSerie">Número de serie</Label>
                        <Input
                          id="numeroSerie"
                          value={assetData.numeroSerie}
                          onChange={(e) => handleChange("numeroSerie", e.target.value)}
                          placeholder="18123564"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Input
                          id="estado"
                          value={assetData.estado}
                          onChange={(e) => handleChange("estado", e.target.value)}
                          placeholder="Bueno"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="encargado">Encargado</Label>
                        <Input
                          id="encargado"
                          value={assetData.encargado}
                          onChange={(e) => handleChange("encargado", e.target.value)}
                          placeholder="Yan Carlos Cervantes"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feature">Agrega características</Label>
                      <div className="flex gap-2">
                        <Input
                          id="feature"
                          value={feature}
                          onChange={(e) => setFeature(e.target.value)}
                          placeholder="Ej. Procesador i7"
                        />
                        <Button type="button" onClick={handleFeatureAdd} variant="outline">
                          Añadir
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {features.map((item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="bg-emerald-50 text-emerald-800 border-emerald-200 cursor-pointer"
                            onClick={() => handleFeatureRemove(item)}
                          >
                            {item}
                          </Badge>
                        ))}
                        {features.length === 0 && (
                          <p className="text-xs text-muted-foreground">Añade detalles técnicos o características únicas.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4 text-center space-y-2">
                    <div className="mx-auto h-24 w-24 rounded-full border border-emerald-200 bg-white flex items-center justify-center text-emerald-700">
                      <Camera className="h-10 w-10" />
                    </div>
                    <p className="text-sm text-slate-700">Cargar imagen del bien</p>
                    <p className="text-xs text-muted-foreground">Suelta tu imagen aquí o haz clic para seleccionarla</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Datos del fabricante</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="fabricanteNombre">Nombre</Label>
                        <Input
                          id="fabricanteNombre"
                          value={assetData.fabricanteNombre}
                          onChange={(e) => handleChange("fabricanteNombre", e.target.value)}
                          placeholder="ColTec S.A.S"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="fabricanteDireccion">Dirección</Label>
                        <Input
                          id="fabricanteDireccion"
                          value={assetData.fabricanteDireccion}
                          onChange={(e) => handleChange("fabricanteDireccion", e.target.value)}
                          placeholder="Cra 5 #17-45 Bogotá"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="fabricanteTelefono">Teléfono</Label>
                        <Input
                          id="fabricanteTelefono"
                          value={assetData.fabricanteTelefono}
                          onChange={(e) => handleChange("fabricanteTelefono", e.target.value)}
                          placeholder="608 875 0504"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Datos del proveedor</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="proveedorNombre">Nombre</Label>
                        <Input
                          id="proveedorNombre"
                          value={assetData.proveedorNombre}
                          onChange={(e) => handleChange("proveedorNombre", e.target.value)}
                          placeholder="ColTec S.A.S"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="proveedorDireccion">Dirección</Label>
                        <Input
                          id="proveedorDireccion"
                          value={assetData.proveedorDireccion}
                          onChange={(e) => handleChange("proveedorDireccion", e.target.value)}
                          placeholder="Cra 5 #17-45 Bogotá"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="proveedorTelefono">Teléfono</Label>
                        <Input
                          id="proveedorTelefono"
                          value={assetData.proveedorTelefono}
                          onChange={(e) => handleChange("proveedorTelefono", e.target.value)}
                          placeholder="608 875 0504"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                  Guardar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}