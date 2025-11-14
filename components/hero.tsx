export default function Hero() {
  return (
    <section className="relative w-full h-[500px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-16">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-blue-600/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-center w-full">
          <h1 className="text-5xl md:text-6xl font-bold text-white max-w-4xl mx-auto mb-6 leading-tight">
            Bienvenidos al sistema de gestión de inventarios de la regional Huila
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Gestiona y solicita mantenimiento para tus equipos de manera rápida y eficiente
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}
