import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest){
  const session = getSessionFromRequest(req)
  if(!session) return NextResponse.redirect(new URL('/', req.url))
  const form = await req.formData()
  const id = String(form.get('id') || '')
  // Allow admin or owner to delete
  const entry = await prisma.timesheetEntry.findUnique({ where: { id } })
  if(!entry) return NextResponse.redirect(new URL('/admin', req.url))
  if(session.role !== 'ADMIN' && entry.userId !== session.userId){
    return NextResponse.redirect(new URL('/dashboard?err=forbidden', req.url))
  }
  await prisma.timesheetEntry.delete({ where: { id } })
  return NextResponse.redirect(new URL(session.role === 'ADMIN' ? '/admin' : '/dashboard', req.url))
}
