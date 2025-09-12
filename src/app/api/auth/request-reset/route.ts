import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

async function sendEmail(to:string, subject:string, html:string){
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const port = Number(process.env.SMTP_PORT || 587)
  if(!host || !user || !pass) return false
  const transporter = nodemailer.createTransport({ host, port, auth: { user, pass } })
  await transporter.sendMail({ from: process.env.SMTP_FROM || user, to, subject, html })
  return true
}

export async function POST(req: NextRequest){
  const form = await req.formData()
  const email = String(form.get('email') || '').toLowerCase()
  const user = await prisma.user.findUnique({ where: { email } })
  if(!user) return NextResponse.redirect(new URL('/reset-password?sent=1', req.url))

  const token = crypto.randomBytes(24).toString('hex')
  const key = 'reset:'+token
  await prisma.setting.upsert({ where: { key }, update: { value: user.id }, create: { key, value: user.id } })

  const base = process.env.APP_BASE_URL || 'http://localhost:3000'
  const link = `${base}/reset/${token}`
  await sendEmail(email, 'Reset your Mavericks Timesheet password', `<p>Click to reset: <a href="${link}">${link}</a></p>`)
  return NextResponse.redirect(new URL('/reset-password?sent=1', req.url))
}
