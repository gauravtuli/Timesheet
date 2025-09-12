import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { setAuthCookie, signSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest){
  const form = await req.formData()
  const email = String(form.get('email') || '').toLowerCase()
  const password = String(form.get('password') || '')

  const domain = process.env.ALLOWED_EMAIL_DOMAIN || 'themavericksindia.com'
  if(!email.endsWith('@'+domain)){
    return NextResponse.redirect(new URL('/?error=domain', req.url))
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if(!user) return NextResponse.redirect(new URL('/?error=auth', req.url))

  const ok = await bcrypt.compare(password, user.password)
  if(!ok) return NextResponse.redirect(new URL('/?error=auth', req.url))

  const token = signSession({ userId: user.id, email: user.email, role: user.role, name: user.name })
  setAuthCookie(token)
  return NextResponse.redirect(new URL(user.role === 'ADMIN' ? '/admin' : '/dashboard', req.url))
}
