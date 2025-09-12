import Link from 'next/link'

export default function Home(){
  return (
    <main className="max-w-md mx-auto mt-24 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold">Sign in to Mavericks Timesheet</h1>
      <p className="text-sm text-gray-600 mt-1">Only @themavericksindia.com accounts allowed.</p>
      <form action="/api/auth/login" method="post" className="space-y-3 mt-6">
        <div>
          <label className="text-sm">Email</label>
          <input name="email" type="email" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input name="password" type="password" required className="w-full border rounded p-2" />
        </div>
        <button className="w-full rounded bg-gray-900 text-white py-2">Sign in</button>
      </form>
      <div className="flex justify-between mt-3 text-sm">
        <Link href="/signup" className="underline">Create account</Link>
        <Link href="/reset-password" className="underline">Forgot password?</Link>
      </div>
    </main>
  )
}
