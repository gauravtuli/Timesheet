import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { setAuthCookie, signSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest){
  const form = await req.formData()
  const name = String(form.get('name') || '')
  const email = String(form.get('email') || '').toLowerCase()
  const password = String(form.get('password') || '')

  const domain = process.env.ALLOWED_EMAIL_DOMAIN || 'themavericksindia.com'
  if(!email.endsWith('@'+domain)){
    return NextResponse.redirect(new URL('/signup?error=domain', req.url))
  }

  const hash = await bcrypt.hash(password, 10)
  try{
    const user = await prisma.user.create({ data: { name, email, password: hash, role: 'USER' } })
    const token = signSession({ userId: user.id, email: user.email, role: user.role, name: user.name })
    setAuthCookie(token)
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }catch(e:any){
    return NextResponse.redirect(new URL('/signup?error=exists', req.url))
  }
}
