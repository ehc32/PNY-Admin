import { Database, Search } from "lucide-react";

export default function ActionButtons() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Consulta de bienes registrados */}
          <button className="group bg-primary hover:bg-primary text-white p-10 rounded-xl transition-all shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-5 h-48 transform hover:scale-105">
            <Database className="w-16 h-16" strokeWidth={1.5} />
            <span className="text-2xl font-bold text-center">
              Consulta de bienes registrados
            </span>
          </button>

          {/* Consulta el estado de tu solicitud */}
          <button className="group bg-primary hover:bg-primary text-white p-10 rounded-xl transition-all shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-5 h-48 transform hover:scale-105">
            <Search className="w-16 h-16" strokeWidth={1.5} />
            <span className="text-2xl font-bold text-center">
              Consulta el estado de tu solicitud
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
