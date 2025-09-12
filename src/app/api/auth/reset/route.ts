import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest){
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  const form = await req.formData()
  const password = String(form.get('password') || '')

  const key = 'reset:'+token
  const record = await prisma.setting.findUnique({ where: { key } })
  if(!record) return NextResponse.redirect(new URL('/?reset=invalid', req.url))

  const userId = record.value
  const hash = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { id: userId }, data: { password: hash } })
  await prisma.setting.delete({ where: { key } })

  return NextResponse.redirect(new URL('/?reset=ok', req.url))
}
