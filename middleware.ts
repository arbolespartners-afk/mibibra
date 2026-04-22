import { NextResponse } from 'next/server'

export function middleware() {
  return new NextResponse('Sitio en mantenimiento', { status: 503 })
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}
