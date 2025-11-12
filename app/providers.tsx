"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "@/lib/auth-context"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"      // aplica la clase "dark" en <html>
      defaultTheme="system"  // usa tema del sistema por defecto (puedes cambiar a "light")
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>{children}</AuthProvider>
    </NextThemesProvider>
  )
}
