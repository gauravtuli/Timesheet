import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST(){
  clearAuthCookie()
  return NextResponse.redirect(new URL('/', process.env.APP_BASE_URL || 'http://localhost:3000'))
}
