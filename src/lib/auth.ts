import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const TOKEN_NAME = 'mt_auth'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export type Session = {
  userId: string
  email: string
  role: 'USER' | 'ADMIN'
  name: string
}

export function signSession(payload: Session) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function setAuthCookie(token: string) {
  cookies().set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function clearAuthCookie() {
  cookies().set({
    name: TOKEN_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  })
}

export function getSessionFromRequest(req: NextRequest): Session | null {
  const token = req.cookies.get(TOKEN_NAME)?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Session
    return decoded
  } catch {
    return null
  }
}
