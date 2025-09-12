import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mavericks Timesheet',
  description: 'Domain-restricted timesheet management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
