"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { User, Settings, LogOut, ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getUserInfoFromToken } from "@/lib/jwt-utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface UserProfileProps {
  collapsed?: boolean
}

export function UserProfile({ collapsed }: UserProfileProps) {
  const router = useRouter()
  const { token, logout, role } = useAuth()

  const onLogout = async () => {
    logout()
    router.replace("/login")
  }

  const onProfile = () => {
    router.push("/perfil")
  }

  if (!token) return null

  // Obtener información del usuario desde el token
  const userInfo = token ? getUserInfoFromToken (token) : null
  const user = {
    name: userInfo?.name || "Administrador",
    email: userInfo?.email || "admin@sistema.com"
  }

  const initials = user.name?.slice(0, 2).toUpperCase() || "AD"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-auto p-3 rounded-xl hover:bg-accent/80 transition-all duration-200 group",
            collapsed && "justify-center px-2",
          )}
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/10 transition-all group-hover:ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-sm font-semibold truncate max-w-[140px] text-foreground">{user.name || "Administrador"}</span>
              <span className="text-xs text-muted-foreground/70 truncate max-w-[140px] font-medium">{user.email}</span>
            </div>
          )}
          {!collapsed && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-64 p-2" align={collapsed ? "start" : "end"}>
        <DropdownMenuLabel className="font-normal p-3 bg-accent/50 rounded-lg mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
              <p className="text-sm font-semibold leading-none text-foreground">Administrador</p>
              <p className="text-xs leading-none text-muted-foreground/80 truncate font-medium">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          onClick={onProfile}
          className="rounded-lg p-3 cursor-pointer hover:bg-accent/80 transition-colors"
        >
          <User className="mr-3 h-4 w-4 text-primary" />
          <span className="font-medium">Mi Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onProfile}
          className="rounded-lg p-3 cursor-pointer hover:bg-accent/80 transition-colors"
        >
          <Settings className="mr-3 h-4 w-4 text-primary" />
          <span className="font-medium">Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          onClick={onLogout}
          className="rounded-lg p-3 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors font-medium"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
