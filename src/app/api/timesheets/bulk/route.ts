import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest){
  const session = getSessionFromRequest(req)
  if(!session) return NextResponse.json({ ok: false }, { status: 401 })
  const body = await req.json()
  const entries = Array.isArray(body.entries) ? body.entries : []
  const valid = entries.map((e:any)=> ({
    userId: session.userId,
    clientId: String(e.clientId),
    month: String(e.month),
    details: String(e.details || ''),
    actualHours: Number(e.actualHours || 0),
    nextMonthProjectedHours: Number(e.nextMonthProjectedHours || 0),
  }))
  await prisma.timesheetEntry.createMany({ data: valid })
  return NextResponse.json({ ok: true })
}
