import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] overflow-hidden">
      {/* Imagen de fondo */}
      <Image
        src="/BANNER.jpg"           // asegúrate que sea .png y esté en /public
        alt="Sistema de gestión de inventarios"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay oscuro suave */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Barra superior con logo + botones */}
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo + nombre del sistema */}
          <div className="flex items-center gap-3">
            {/* Logo (cámbialo por la ruta correcta o comenta este bloque si no tienes logo) */}
            <Image
              src="/LOGO-1.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-white font-semibold text-lg drop-shadow">
              Piscícola New York
            </span>
          </div>

          {/* Botones a la derecha */}
          <div className="flex gap-3">
            <a
              href="/login"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md shadow transition"
            >
              Ingresar
            </a>
            <a
              href="/register"
              className="px-6 py-2 bg-green-500/90 hover:bg-green-600 text-white text-sm font-semibold rounded-md shadow transition"
            >
              Registrarse
            </a>
          </div>
        </div>
      </header>

      {/* Contenido principal: texto a la izquierda */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
        <div className="max-w-3xl text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            Bienvenidos al sistema de gestión de inventarios
            <span className="block text-white">
              de la regional Huila
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-md max-w-2xl">
            Gestiona y solicita mantenimiento para tus equipos de manera rápida y eficiente.
          </p>
        </div>
      </div>
    </section>
  );
}
