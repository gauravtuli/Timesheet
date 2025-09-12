import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest){
  const form = await req.formData()
  const id = String(form.get('id') || '')
  await prisma.timesheetEntry.deleteMany({ where: { clientId: id } })
  await prisma.client.delete({ where: { id } })
  return NextResponse.redirect(new URL('/admin', req.url))
}
