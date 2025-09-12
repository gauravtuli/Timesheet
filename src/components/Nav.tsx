'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Nav({ role }: { role: 'USER' | 'ADMIN' }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  return (
    <nav className="w-full border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <Link href="/dashboard" className="font-semibold">Mavericks Timesheet</Link>
        <div className="flex gap-4 items-center">
          <Link className="hover:underline" href="/dashboard">My Timesheet</Link>
          {role === 'ADMIN' && <Link className="hover:underline" href="/admin">Admin</Link>}
          <form action="/api/auth/logout" method="post">
            <button className="px-3 py-1 rounded bg-gray-900 text-white">Logout</button>
          </form>
        </div>
      </div>
    </nav>
  )
}
