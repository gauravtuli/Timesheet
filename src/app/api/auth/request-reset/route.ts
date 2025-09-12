import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs' // Ensure the route runs on Node.js runtime

async function sendEmail(to: string, subject: string, html: string) {
  // Get SMTP credentials from environment variables
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const port = Number(process.env.SMTP_PORT || 587)

  // If SMTP credentials are not available, exit
  if (!host || !user || !pass) return false

  // Create a transporter using the SMTP credentials
  const transporter = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  })

  // Convert HTML to plain text (basic fallback)
  const text = html.replace(/<[^>]*>/g, '') // Strip out HTML tags for plain-text version

  // Send email using the transporter
  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,  // From email address
    to,                                  // Recipient email address
    subject,                             // Subject line
    text,                                // Plain text version
    html,                                // HTML version
  })

  return true
}

export async function POST(req: NextRequest) {
  const form = await req.formData()

  const email = form.get('email')?.toString()
  if (!email) return new Response('Email is required', { status: 400 })

  // Generate a reset link (you can adjust this URL)
  const resetLink = `https://your-domain.com/reset-password?token=some-generated-token`

  const html = `
    <h1>Password Reset Request</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
  `

  const subject = 'Password Reset Request'

  // Send the email with the reset link
  const emailSent = await sendEmail(email, subject, html)
  
  if (emailSent) {
    return new Response('Password reset email sent', { status: 200 })
  } else {
    return new Response('Failed to send email', { status: 500 })
  }
}
