"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface MenuItem {
  name: string
  route: string
}

export interface MenuModule {
  modulo: string
  views: MenuItem[]
}

export interface RegistroData {
  name: string
  email: string
  phone: string
  typeDocument: string
  numberDocument: string
  password: string
}

export interface AuthContextType {
  token: string | null
  menu: MenuModule[] | null
  role: string | null
  loading: boolean
  // 👇 renombramos el parámetro para evitar conflicto con window.document
  login: (docNumber: string, password: string, typeDocument: string) => Promise<void>
  registro: (data: RegistroData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [menu, setMenu] = useState<MenuModule[] | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token")
    const savedMenu = localStorage.getItem("auth_menu")
    const savedRole = localStorage.getItem("auth_role")

    if (savedToken && savedMenu && savedRole) {
      setToken(savedToken)
      setMenu(JSON.parse(savedMenu))
      setRole(savedRole)
    }
    setLoading(false)
  }, [])

  const login = async (docNumber: string, password: string, typeDocument: string) => {
    setLoading(true)
    try {
      // Validación rápida en cliente
      if (!docNumber || typeof docNumber !== "string") {
        throw new Error("El número de documento es requerido.")
      }
      if (!password) {
        throw new Error("La contraseña es requerida.")
      }

      const response = await fetch("https://stingray-app-e496q.ondigitalocean.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // 👇 nombre correcto según tu API
          document: docNumber,
          password,
          typeDocument,
        }),
      })

      if (!response.ok) {
        // Intenta leer el shape de error del backend
        let message = "Error en el inicio de sesión"
        try {
          const error = await response.json()
          // puede venir como { message } o como array de errores de validación
          if (typeof error?.message === "string") message = error.message
          else if (Array.isArray(error?.errors)) message = error.errors.join(", ")
        } catch {
          // ignora si no se puede parsear JSON
        }
        throw new Error(message)
      }

      const data = await response.json()

      const accessToken = data.result.access_token
      const menuData = data.result.menu.menu
      const userRole  = data.result.menu.role

      localStorage.setItem("auth_token", accessToken)
      localStorage.setItem("auth_menu", JSON.stringify(menuData))
      localStorage.setItem("auth_role", userRole)

      // 👇 usa el document global explícito para evitar sombras
      globalThis.document.cookie = `auth_token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`

      setToken(accessToken)
      setMenu(menuData)
      setRole(userRole)
    } finally {
      setLoading(false)
    }
  }

  const registro = async (data: RegistroData) => {
    setLoading(true)
    try {
      const response = await fetch("https://stingray-app-e496q.ondigitalocean.app/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        let message = "Error en el registro"
        try {
          const error = await response.json()
          if (typeof error?.message === "string") message = error.message
          else if (Array.isArray(error?.errors)) message = error.errors.join(", ")
        } catch {
          // ignora si no se puede parsear JSON
        }
        throw new Error(message)
      }

      // El registro fue exitoso, no necesitamos hacer login automático
      // El usuario será redirigido a la página de login
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_menu")
    localStorage.removeItem("auth_role")

    // borra cookie
    globalThis.document.cookie = "auth_token=; path=/; max-age=0"

    setToken(null)
    setMenu(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, menu, role, loading, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }
  return context
}
