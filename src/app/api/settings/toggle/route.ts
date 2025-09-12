import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest){
  const form = await req.formData()
  const enabled = String(form.get('enabled') || 'true')
  await prisma.setting.upsert({ where: { key: 'frontend_enabled' }, update: { value: enabled }, create: { key: 'frontend_enabled', value: enabled } })
  return NextResponse.redirect(new URL('/admin', req.url))
}
