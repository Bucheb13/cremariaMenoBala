import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isAuth = req.cookies.get('auth')?.value === 'true'
  const isLoginPage = req.nextUrl.pathname.startsWith('/login')

  if (!isAuth && !isLoginPage) {
    // Redireciona para login se não autenticado
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isAuth && isLoginPage) {
    // Se já logado, evita voltar ao login
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

// Aplica o middleware apenas em rotas específicas
export const config = {
  matcher: ['/admin/:path*', '/login'],
}
