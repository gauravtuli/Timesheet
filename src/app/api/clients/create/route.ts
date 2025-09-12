import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest){
  const form = await req.formData()
  const name = String(form.get('name') || '').trim()
  if(!name) return NextResponse.redirect(new URL('/admin?err=noname', req.url))

  await prisma.client.upsert({
    where: { name },
    update: { isActive: true },
    create: { name, isActive: true }
  })
  return NextResponse.redirect(new URL('/admin', req.url))
}
