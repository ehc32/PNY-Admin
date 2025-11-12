"use client"

import { ChevronRight, Settings2, FileText, Users, Shield, MapPin, Folder } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfiguracionPage() {
  const parametrizacionItems = [
    {
      title: "Gestión de vistas",
      description: "Administra las vistas y rutas del sistema",
      href: "/configuracion/parametrizacion/roles",
      icon: Shield,
    },
    {
      title: "Asignación de permisos",
      description: "Asigna permisos a usuarios y roles",
      href: "/configuracion/parametrizacion/permisos",
      icon: Users,
    },
    {
      title: "Gestión de módulos",
      description: "Administra los módulos del sistema",
      href: "/configuracion/parametrizacion/rutas",
      icon: MapPin,
    },
    {
      title: "Gestión de Ambientes",
      description: "Administra los ambientes del sistema",
      href: "/configuracion/parametrizacion/ambientes",
      icon: Settings2,
    },
    {
      title: "Configuración del Sistema",
      description: "Configura email, SMS y WhatsApp",
      href: "/configuracion/sistema",
      icon: Settings2,
    },
  ]

  const registrosItems = [
    {
      title: "Eventos del sistema",
      description: "Consulta los logs y eventos del sistema",
      href: "/configuracion/registros/eventos",
      icon: FileText,
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Administra los parámetros y configuraciones del sistema
        </p>
      </div>

      {/* Parametrización Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Parametrización</h2>
          <p className="text-sm text-muted-foreground">
            Configura los elementos principales del sistema
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parametrizacionItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Registros del sistema Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Registros del sistema</h2>
          <p className="text-sm text-muted-foreground">
            Consulta la actividad y eventos del sistema
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registrosItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
