export default function Hero() {
  return (
    <section className="relative w-full h-[520px] overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_30%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(115deg,#ffffff33_0%,#ffffff00_50%,#ffffff33_100%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-left w-full space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-50/90">Regional Huila</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-3xl leading-tight drop-shadow-sm">
            Bienvenidos al sistema de gestión de inventarios y mantenimiento
          </h1>
          <p className="text-lg md:text-xl text-emerald-50/90 max-w-2xl leading-relaxed">
            Visualiza los bienes registrados, solicita órdenes de mantenimiento y haz seguimiento a cada caso con una interfaz renovada.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-emerald-50/90">
            <span className="px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-200/20">Diseño institucional</span>
            <span className="px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-200/20">Flujo público y seguro</span>
            <span className="px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-200/20">Órdenes con número de seguimiento</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
