"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Mouse as House } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        {/* quitamos max-w y centrado; usamos solo padding para pegarlo más a la izquierda */}
        <div className="px-4 sm:px-6 lg:px-10 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-3 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <House className="w-4 h-4" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Inicio</span>
          </nav>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            Administrador
          </h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="px-4 sm:px-6 lg:px-10">
          <div className="flex gap-6 overflow-x-auto text-sm">
            <Link
              href="/dashboard"
              className="py-3 border-b-2 border-primary font-medium text-foreground"
            >
              Home
            </Link>
            <Link
              href="/dashboard/usuario"
              className="py-3 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground hover:border-border"
            >
              Usuario
            </Link>
            <Link
              href="/dashboard/inventario"
              className="py-3 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground hover:border-border"
            >
              Inventario
            </Link>
            <Link
              href="/dashboard/maquinas"
              className="py-3 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground hover:border-border"
            >
              Máquinas
            </Link>
            <Link
              href="/dashboard/mantenimientos"
              className="py-3 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground hover:border-border"
            >
              Mantenimientos
            </Link>
            <Link
              href="/dashboard/ajustes"
              className="py-3 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground hover:border-border"
            >
              Ajustes
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="bg-background py-6">
        {/* también sin max-w centrado: queda más pegado al sidebar */}
        <div className="px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-5 items-start mb-4">
            {/* Left Column - What do you want to do? */}
            <div className="w-full lg:w-5/12 xl:w-5/12">
              <div className="bg-card border border-border rounded-xl shadow-sm p-5 h-full">
                <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground mb-2">
                  ¿Qué quieres hacer hoy?
                </h2>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Accede directo a los módulos que usas a diario: gestiona trámites,
                  administra usuarios o ajusta parámetros.
                </p>
                <div className="flex justify-center">
                  <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72">
                    <Image
                      src="/Listas/options.svg"
                      alt="¿Qué quieres hacer hoy?"
                      width={288}
                      height={288}
                      className="object-contain w-full h-full"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-7/12 xl:w-7/12">
              <div className="flex flex-col gap-5">
                {/* Operación diaria */}
                <section className="bg-card border border-border rounded-xl shadow-sm p-5">
                  <header className="mb-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-1">
                      Operación diaria
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Accesos rápidos para mantener los procesos al día.
                    </p>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Bandeja de pendientes */}
                    <Link href="/dashboard/bandeja-pendientes">
                      <div className="group cursor-pointer bg-background/60 border border-border rounded-lg h-full p-4 flex gap-4 items-start hover:border-primary/40 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src="/Listas/options.svg"
                            alt="Bandeja de pendientes"
                            width={60}
                            height={60}
                            className="opacity-80"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-card-foreground text-sm mb-1">
                              Gestion de Usuarios
                            </h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              Gestion de los usuarios del sistema.
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Archivos */}
                    <Link href="/dashboard/archivos">
                      <div className="group cursor-pointer bg-background/60 border border-border rounded-lg h-full p-4 flex gap-4 items-start hover:border-primary/40 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src="/Listas/options.svg"
                            alt="Archivos"
                            width={60}
                            height={60}
                            className="opacity-80"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-card-foreground text-sm mb-1">
                              Control de Acceso
                            </h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              Control de los accesos del sistema.
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Mensajes */}
                    <Link href="/dashboard/mensajes" className="sm:col-span-2">
                      <div className="group cursor-pointer bg-background/60 border border-border rounded-lg h-full p-4 flex gap-4 items-start hover:border-primary/40 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src="/Listas/options.svg"
                            alt="Mensajes"
                            width={60}
                            height={60}
                            className="opacity-80"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-card-foreground text-sm mb-1">
                              Crear Usuario
                            </h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              Crea un nuevo usuario.
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </section>

                {/* Gestión de usuarios */}
                <section className="bg-card border border-border rounded-xl shadow-sm p-5">
                  <header className="mb-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-1">
                      Gestión de Mantenimientos
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Administra los mantenimientos desde un solo lugar.
                    </p>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Usuarios */}
                    <Link href="/dashboard/users">
                      <div className="group cursor-pointer bg-background/60 border border-border rounded-lg h-full p-4 flex gap-4 items-start hover:border-primary/40 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src="/Listas/options.svg"
                            alt="Usuarios"
                            width={60}
                            height={60}
                            className="opacity-80"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-card-foreground text-sm mb-1">
                              Usuarios
                            </h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              Crea usuarios nuevos y administra sus roles.
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Administradores Regulares */}
                    <Link href="/dashboard/administradores">
                      <div className="group cursor-pointer bg-background/60 border border-border rounded-lg h-full p-4 flex gap-4 items-start hover:border-primary/40 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src="/Listas/options.svg"
                            alt="Administradores"
                            width={60}
                            height={60}
                            className="opacity-80"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-card-foreground text-sm mb-1">
                              Administradores Regulares
                            </h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              Crea y supervisa Administradores Generales activos.
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </section>

                {/* Configuración y seguridad */}
                <section className="bg-card border border-border rounded-xl shadow-sm p-5 mb-2">
                  <header className="mb-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-1">
                      Modulo de Parametrizacion
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Modulo de Parametrizacion
                    </p>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Configuración */}
                    <Link href="/dashboard/configuracion">
                      <div className="group cursor-pointer bg-background/60 border border-border rounded-lg h-full p-4 flex gap-4 items-start hover:border-primary/40 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src="/Listas/options.svg"
                            alt="Configuración"
                            width={60}
                            height={60}
                            className="opacity-80"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-card-foreground text-sm mb-1">
                              Parametrizacion
                            </h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              Ajusta parámetros y valores del entorno.
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Integración Encryption */}
                    <Link href="/dashboard/integracion">
                      <div className="group cursor-pointer bg-background/60 border border-border rounded-lg h-full p-4 flex gap-4 items-start hover:border-primary/40 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src="/Listas/options.svg"
                            alt="Integración Encryption"
                            width={60}
                            height={60}
                            className="opacity-80"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-card-foreground text-sm mb-1">
                              Integración Encryption
                            </h4>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              Administra claves, rutas y políticas de Encryption.
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
