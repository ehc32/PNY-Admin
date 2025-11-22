"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  ChevronRight,
  LogOut,
  ChevronDown,
  Folder,
  User,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { token, menu, role, logout } = useAuth()
  const [userInfo, setUserInfo] = useState({ email: "Usuario", initials: "US" })

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  // Extraer email e iniciales del token JWT
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        const email = payload.email || "Usuario"
        const initials = email.split("@")[0].slice(0, 2).toUpperCase()
        setUserInfo({ email, initials })
      } catch {
        // en caso de error mantenemos los valores por defecto
      }
    }
  }, [token])

  if (!token || !menu) {
    return null
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      {/* HEADER */}
      <SidebarHeader className="px-3 pb-3 pt-4 bg-sidebar">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent/60">
            <img
              src="/LOGO-1.png"
              alt="Logo"
              className="h-7 w-7 object-contain"
            />
          </div>

          {!isCollapsed && (
            <>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-base font-semibold leading-tight tracking-tight truncate">
                  PNY
                </span>
                <span className="text-xs text-sidebar-foreground/60 truncate">
                  Piscícola New York S.A.
                </span>
                <span className="text-xs font-medium text-primary truncate">
                  {role}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1">
                <ModeToggle />
              </div>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator className="my-1 bg-sidebar-border/40" />

      {/* CONTENIDO PRINCIPAL */}
      <SidebarContent>
        {/* NAVEGACIÓN PRINCIPAL */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              Navegación
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className={cn("px-2", isCollapsed && "px-1")}>
            <SidebarMenu className="gap-1">
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                  className={cn(
                    "group h-9 rounded-md text-sm transition-all duration-200",
                    pathname === "/dashboard"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Link href="/dashboard" className="flex items-center w-full">
                    <LayoutDashboard
                      className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "h-5 w-5" : "h-4 w-4"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="ml-3 flex-1 truncate">Dashboard</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Acciones Generales */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/acciones"}
                  tooltip="Acciones generales"
                  className={cn(
                    "group h-9 rounded-md text-sm transition-all duration-200",
                    pathname === "/dashboard/acciones"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Link
                    href="/dashboard/acciones"
                    className="flex items-center w-full"
                  >
                    <LayoutDashboard
                      className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "h-5 w-5" : "h-4 w-4"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="ml-3 flex-1 truncate">
                        Acciones generales
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MÓDULOS DINÁMICOS */}
        {menu.length > 0 && (
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="px-3 mt-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Módulos
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent className={cn("px-2", isCollapsed && "px-1")}>
              <SidebarMenu className="gap-1">
                {menu.map((modulo) => {
                  const isModuleActive = modulo.views.some((view) =>
                    pathname.startsWith(view.route)
                  )

                  return (
                    <Collapsible
                      key={modulo.modulo}
                      defaultOpen={isModuleActive} // solo se abre el módulo activo
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={modulo.modulo}
                            className={cn(
                              "h-9 rounded-md text-sm transition-all duration-200",
                              isModuleActive
                                ? "bg-sidebar-accent/60 text-sidebar-accent-foreground shadow-sm"
                                : "hover:bg-sidebar-accent/40 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                              isCollapsed && "justify-center px-0"
                            )}
                          >
                            <Folder
                              className={cn(
                                "flex-shrink-0",
                                isCollapsed ? "h-5 w-5" : "h-4 w-4"
                              )}
                            />
                            {!isCollapsed && (
                              <>
                                <span className="ml-2 flex-1 truncate">
                                  {modulo.modulo}
                                </span>
                                <ChevronDown className="ml-auto h-4 w-4 text-sidebar-foreground/60 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {!isCollapsed && (
                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-3 border-l border-sidebar-border/40">
                              {modulo.views.map((view) => {
                                const isActive = pathname.startsWith(
                                  view.route
                                )
                                return (
                                  <SidebarMenuSubItem key={view.route}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isActive}
                                      className={cn(
                                        "h-8 text-xs rounded-md my-0.5 transition-all duration-200",
                                        isActive
                                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                          : "hover:bg-sidebar-accent/40"
                                      )}
                                    >
                                      <Link href={view.route}>{view.name}</Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* CUENTA / PERFIL / CONFIGURACIÓN */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 mt-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              Cuenta
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className={cn("px-2", isCollapsed && "px-1")}>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/perfil"}
                  tooltip="Mi perfil"
                  className={cn(
                    "group h-9 rounded-md text-sm transition-all duration-200",
                    pathname === "/perfil"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Link href="/perfil" className="flex items-center w-full">
                    <User
                      className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "h-5 w-5" : "h-4 w-4"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="flex-1 truncate ml-3">Mi perfil</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === "/configuracion" ||
                    pathname.startsWith("/configuracion/")
                  }
                  tooltip="Configuración"
                  className={cn(
                    "group h-9 rounded-md text-sm transition-all duration-200",
                    pathname === "/configuracion" ||
                      pathname.startsWith("/configuracion/")
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Link
                    href="/configuracion"
                    className="flex items-center w-full"
                  >
                    <Settings
                      className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "h-5 w-5" : "h-4 w-4"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="flex-1 truncate ml-3">
                        Configuración
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER / USUARIO */}
      <SidebarFooter
        className={cn(
          "mt-auto border-t border-sidebar-border/40",
          isCollapsed ? "p-1.5" : "p-2.5"
        )}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={cn(
                    "group h-11 rounded-md transition-all duration-200 hover:bg-sidebar-accent/80 data-[state=open]:bg-sidebar-accent",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Avatar className="h-8 w-8 rounded-md border border-sidebar-border/60">
                    <AvatarImage
                      src="/diverse-user-avatars.png"
                      alt="Usuario"
                    />
                    <AvatarFallback className="rounded-md bg-sidebar-accent text-xs font-semibold text-sidebar-foreground">
                      {userInfo.initials}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <div className="grid flex-1 text-left leading-tight min-w-0">
                        <span className="truncate text-sm font-semibold">
                          {userInfo.email.split("@")[0]}
                        </span>
                        <span className="truncate text-[11px] text-sidebar-foreground/60">
                          {userInfo.email}
                        </span>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 text-sidebar-foreground/60 transition-transform group-data-[state=open]:rotate-90 flex-shrink-0" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-60"
                align="end"
                side={isCollapsed ? "right" : "bottom"}
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {userInfo.email.split("@")[0]}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userInfo.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/perfil")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Ir a mi perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
