import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}

export function middleware(req: NextRequest) {
  // Edge-safe: only check for presence of auth cookie (do NOT verify JWT here)
  const token = req.cookies.get('mt_auth')?.value
  const url = req.nextUrl

  if (!token) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Basic path guard: block /admin for non-admins using a lightweight hint cookie.
  // (Actual role enforcement still happens on the server pages/API.)
  const role = req.cookies.get('mt_role')?.value // optional: set this cookie at login
  if (url.pathname.startsWith('/admin') && role !== 'ADMIN') {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
