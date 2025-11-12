"use client"

import { Settings2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AmbientesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 dark:from-green-950 dark:via-green-900 dark:to-emerald-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/configuracion">
            <Button variant="ghost" size="icon" className="hover:bg-green-200 dark:hover:bg-green-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="bg-green-600 dark:bg-green-700 text-white rounded-lg p-6 shadow-lg flex-1">
            <div className="flex items-center gap-3">
              <Settings2 className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Gestión de Ambientes</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="border-green-200 dark:border-green-800 shadow-md">
          <CardHeader className="bg-white dark:bg-gray-800">
            <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">
              Ambientes
            </CardTitle>
            <CardDescription>
              Administra los ambientes del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <Settings2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Módulo en desarrollo
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Esta funcionalidad estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
