import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  const isAuthPage = request.nextUrl.pathname.startsWith("/login")
  const isDashboardPage =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/estadisticas") ||
    request.nextUrl.pathname.startsWith("/perfil")

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
