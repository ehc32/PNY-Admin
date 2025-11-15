"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Mouse as House } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <House className="w-4 h-4" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Inicio</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground">Administrador</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            <Link href="/dashboard" className="py-4 px-1 border-b-2 border-primary font-medium text-foreground text-sm">
              Home
            </Link>
            <Link href="/dashboard/usuario" className="py-4 px-1 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground text-sm hover:border-border">
              Usuario
            </Link>
            <Link href="/dashboard/inventario" className="py-4 px-1 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground text-sm hover:border-border">
              Inventario
            </Link>
            <Link href="/dashboard/maquinas" className="py-4 px-1 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground text-sm hover:border-border">
              Máquinas
            </Link>
            <Link href="/dashboard/mantenimientos" className="py-4 px-1 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground text-sm hover:border-border">
              Mantenimientos
            </Link>
            <Link href="/dashboard/ajustes" className="py-4 px-1 border-b-2 border-transparent font-medium text-muted-foreground hover:text-foreground text-sm hover:border-border">
              Ajustes
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Bootstrap-like Layout */}
      <section className="bg-background py-8">
        <div className="w-full px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start mb-4">
            {/* Left Column - What do you want to do? */}
            <div className="w-full lg:w-5/12 xl:w-5/12">
              <div className="bg-card border border-border rounded-2xl shadow-sm p-4 h-full">
                <h2 className="text-2xl font-bold text-card-foreground mb-3">
                  ¿Qué quieres hacer hoy?
                </h2>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Accede directo a los módulos que usas a diario: gestiona trámites, 
                  administra usuarios o ajusta parámetros.
                </p>
                <div className="flex justify-center">
                  <div className="relative mx-auto w-80 h-80">
                    <Image
                      src="/Listas/options.svg"
                      alt="¿Qué quieres hacer hoy?"
                      width={320}
                      height={320}
                      className="object-contain w-full h-full"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Operations and User Management */}
            <div className="w-full lg:w-7/12 xl:w-7/12">
              <div className="flex flex-col gap-4">
              {/* Operación Diaria Section */}
              <div className="bg-card border border-border rounded-4xl shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Operación diaria</h3>
                  <p className="text-muted-foreground text-sm">
                    Accesos rápidos para mantener los procesos al día.
                  </p>
                </div>

                {/* Operations Grid - 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Bandeja de pendientes */}
                  <Link href="/dashboard/bandeja-pendientes">
                    <div className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-card border border-border rounded-2xl h-full hover:border-muted p-4 flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src="/Listas/options.svg"
                          alt="Bandeja de pendientes"
                          width={70}
                          height={70}
                          className="opacity-70"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-card-foreground text-base mb-1">
                            Bandeja de pendientes
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Aprueba o rechaza las solicitudes pendientes.
                          </p>
                        </div>
                        <div className="flex justify-end pt-2">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Archivos */}
                  <Link href="/dashboard/archivos">
                    <div className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-card border border-border rounded-2xl h-full hover:border-muted p-4 flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src="/Listas/options.svg"
                          alt="Archivos"
                          width={70}
                          height={70}
                          className="opacity-70"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-card-foreground text-base mb-1">
                            Archivos
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Consulta y organiza archivos del repositorio seguro.
                          </p>
                        </div>
                        <div className="flex justify-end pt-2">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Mensajes */}
                  <Link href="/dashboard/mensajes" className="sm:col-span-2">
                    <div className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-card border border-border rounded-2xl h-full hover:border-muted p-4 flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src="/Listas/options.svg"
                          alt="Mensajes"
                          width={70}
                          height={70}
                          className="opacity-70"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-card-foreground text-base mb-1">
                            Mensajes
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Monitorea el estado de los mensajes procesados.
                          </p>
                        </div>
                        <div className="flex justify-end pt-2">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Gestión de usuarios Section */}
              <div className="bg-card border border-border rounded-4xl shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Gestión de usuarios</h3>
                  <p className="text-muted-foreground text-sm">
                    Administra roles y equipos desde un solo lugar.
                  </p>
                </div>

                {/* User Management Grid - 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Usuarios */}
                  <Link href="/dashboard/users">
                    <div className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-card border border-border rounded-2xl h-full hover:border-muted p-4 flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src="/Listas/options.svg"
                          alt="Usuarios"
                          width={70}
                          height={70}
                          className="opacity-70"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-card-foreground text-base mb-1">
                            Usuarios
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Crea usuarios nuevos y administra sus roles.
                          </p>
                        </div>
                        <div className="flex justify-end pt-2">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Administradores Regulares */}
                  <Link href="/dashboard/administradores">
                    <div className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-card border border-border rounded-2xl h-full hover:border-muted p-4 flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src="/Listas/options.svg"
                          alt="Administradores"
                          width={70}
                          height={70}
                          className="opacity-70"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-card-foreground text-base mb-1">
                            Administradores Regulares
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Crea y supervisa Administradores Generales activos.
                          </p>
                        </div>
                        <div className="flex justify-end pt-2">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Configuración y seguridad Section */}
              <div className="bg-card border border-border rounded-4xl shadow-sm p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Configuración y seguridad</h3>
                  <p className="text-muted-foreground text-sm">
                    Mantén la plataforma alineada con las políticas de TEMS.
                  </p>
                </div>

                {/* Configuration Grid - 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Configuración */}
                  <Link href="/dashboard/configuracion">
                    <div className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-card border border-border rounded-2xl h-full hover:border-muted p-4 flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src="/Listas/options.svg"
                          alt="Configuración"
                          width={70}
                          height={70}
                          className="opacity-70"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-card-foreground text-base mb-1">
                            Configuración
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Ajusta parámetros y valores del entorno.
                          </p>
                        </div>
                        <div className="flex justify-end pt-2">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Integración Encryption */}
                  <Link href="/dashboard/integracion">
                    <div className="group hover:shadow-md transition-all duration-300 cursor-pointer bg-card border border-border rounded-2xl h-full hover:border-muted p-4 flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        <Image
                          src="/Listas/options.svg"
                          alt="Integración Encryption"
                          width={70}
                          height={70}
                          className="opacity-70"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-card-foreground text-base mb-1">
                            Integración Encryption
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Administra claves, rutas y políticas de Encryption.
                          </p>
                        </div>
                        <div className="flex justify-end pt-2">
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
