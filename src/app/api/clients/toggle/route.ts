import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest){
  const form = await req.formData()
  const id = String(form.get('id') || '')
  const c = await prisma.client.findUnique({ where: { id } })
  if(!c) return NextResponse.redirect(new URL('/admin?err=noclient', req.url))
  await prisma.client.update({ where: { id }, data: { isActive: !c.isActive } })
  return NextResponse.redirect(new URL('/admin', req.url))
}
