import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Piscicultura New York</h3>
            <p className="text-blue-100 mb-2">
              Empresa líder en producción y distribución de tilapia de excelente calidad.
            </p>
            <p className="text-blue-100 text-sm">
              Comprometidos con la excelencia, inocuidad y normatividad internacional.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <p className="text-blue-100 mb-2">
              Teléfono: +57 (68 8) 9757040
            </p>
            <p className="text-blue-100 mb-2">
              Email: info@piscicolanewyork.com
            </p>
            <p className="text-blue-100 text-sm">
              Carrera 9 No 05-50, Huila, Colombia
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-white transition">Inicio</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition">Productos</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition">Certificaciones</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition">Contacto</a></li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-8 py-6 border-t border-blue-800 border-b">
          <a href="#" className="text-blue-100 hover:text-teal-400 transition">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="text-blue-100 hover:text-teal-400 transition">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-blue-100 hover:text-teal-400 transition">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="text-blue-100 hover:text-teal-400 transition">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="#" className="text-blue-100 hover:text-teal-400 transition">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-blue-100 text-sm">
            Copyright © 2025 Piscicultura New York. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
