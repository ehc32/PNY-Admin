export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50">
      {/* CONTENEDOR PRINCIPAL DEL HEADER: fondo blanco + texto oscuro */}
      <div className="relative bg-white text-slate-900 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 items-center">
            
            {/* Columna 1: Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">PNY</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-xl text-slate-900">Piscícola New York</div>
                <div className="text-xs text-slate-500">Calidad Premium</div>
              </div>
            </div>
            
            {/* Columna 2: Navegación Central */}
            <nav className="flex items-center justify-center">
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="text-slate-700 hover:text-slate-900 font-medium transition-colors relative group">
                  Inicio
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all group-hover:w-full"></span>
                </a>

                {/* Dropdown Sobre nosotros */}
                <div className="relative group">
                  <a href="#" className="text-slate-700 hover:text-slate-900 font-medium transition-colors flex items-center gap-1">
                    Sobre nosotros
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded-t-lg">Sobre nosotros</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded-b-lg">Nuestras políticas</a>
                  </div>
                </div>

                <a href="#" className="text-slate-700 hover:text-slate-900 font-medium transition-colors relative group">
                  Catálogo
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all group-hover:w-full"></span>
                </a>

                {/* Dropdown Blog */}
                <div className="relative group">
                  <a href="#" className="text-slate-700 hover:text-slate-900 font-medium transition-colors flex items-center gap-1">
                    Blog
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded-t-lg">Blog</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded-b-lg">Galería</a>
                  </div>
                </div>

                {/* Dropdown Contacto */}
                <div className="relative group">
                  <a href="#" className="text-slate-700 hover:text-slate-900 font-medium transition-colors flex items-center gap-1">
                    Contacto
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded-t-lg">Contacto</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-50 rounded-b-lg">PQRS</a>
                  </div>
                </div>
              </div>

              {/* Menú hamburguesa móvil */}
              <button className="md:hidden text-slate-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </nav>

            {/* Columna 3: Botón Pago Online */}
            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Pago online
              </button>
            </div>
          </div>
        </div>

        {/* *** OLA REDONDEADA EN LA PARTE INFERIOR DEL HEADER *** */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-12 md:h-16"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            {/* Ola con curvas más suaves y naturales */}
            <path
              d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
              className="fill-slate-700"
            />
          </svg>
        </div>
      </div>
    </header>
  )};