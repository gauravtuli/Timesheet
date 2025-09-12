import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from './lib/auth'

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}

export function middleware(req: NextRequest) {
  const session = getSessionFromRequest(req)
  const url = req.nextUrl

  if (!session) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (url.pathname.startsWith('/admin') && session.role !== 'ADMIN') {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
