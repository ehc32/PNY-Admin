import Image from "next/image"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  // Si ya hay token en cookie, redirige al dashboard
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (token) {
    redirect("/dashboard")
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center gap-3 md:justify-start justify-center">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-2">
            <Image src="/LOGO-1.png" alt="" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight">PNY</h2>
            <p className="text-sm text-muted-foreground font-medium">Piscícola New York</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-background/40 z-10" />
        <img
          src="/PYLOGO.png"
          alt="SAAVE ARQUITECTO Background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
        />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <h3 className="text-4xl font-bold mb-2">Piscícola New York</h3>
          <p className="text-lg text-white/90">Piscícola New York es una empresa colombiana líder en la producción, procesamiento y exportación de tilapia de alta calidad</p>
        </div>
      </div>
    </div>
  )
}