'use client'

import { useState } from 'react'

export default function MaintenanceForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serialNumber: '',
    description: '',
    inventoryCode: '',
    maintenanceType: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission here
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-12 rounded-xl shadow-xl">
          <h2 className="text-4xl font-bold text-teal-700 mb-10 text-center">
            Realiza tu solicitud de mantenimiento
          </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Fila 1: Nombre, Teléfono, Serie */}
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Nombre del solicitante
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del solicitante"
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Número de teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Número de teléfono"
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Número de serie
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="Número de serie"
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Descripción falla presentada
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción falla presentada"
              rows={5}
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none transition-all"
            />
          </div>

          {/* Fila 2: Código inventario, Tipo mantenimiento */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Código inventario
              </label>
              <input
                type="text"
                name="inventoryCode"
                value={formData.inventoryCode}
                onChange={handleChange}
                placeholder="Código de inventario"
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Tipo de mantenimiento
              </label>
              <select
                name="maintenanceType"
                value={formData.maintenanceType}
                onChange={handleChange}
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
              >
                <option value="">Selecciona el tipo de mantenimiento</option>
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
                <option value="predictivo">Predictivo</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white px-12 py-4 text-xl rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Enviar solicitud
            </button>
          </div>
        </form>
        </div>
      </div>
    </section>
  )
}
