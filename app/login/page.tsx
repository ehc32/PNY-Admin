import Image from "next/image"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (token) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration/Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-16 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-lg rotate-12"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white rounded-full"></div>
        </div>
        
        {/* Geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl rotate-12 backdrop-blur-sm"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-white/15 to-white/5 rounded-2xl -rotate-12 backdrop-blur-sm"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full backdrop-blur-sm"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                <div className="relative h-10 w-10">
                  <Image src="/LOGO-1.png" alt="Logo" fill className="object-contain" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Banco Popular</h1>
              <p className="text-xl text-white/90 font-light">Panel de Administración</p>
            </div>
            <div className="space-y-4 text-white/80">
              <p className="text-lg">Gestiona tu plataforma de manera segura y eficiente</p>
              <div className="flex items-center justify-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm">Seguro</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm">Rápido</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm">Confiable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 p-2 shadow-lg">
                <Image src="/LOGO-1.png" alt="Logo" fill className="object-contain" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Banco Popular</h1>
            <p className="text-gray-600">Panel de Administración</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
              <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
            </div>
            
            <LoginForm />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2024 Banco Popular. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
