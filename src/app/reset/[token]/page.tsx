import Link from 'next/link'

export default function ResetToken({ params }:{ params: { token: string } }){
  const token = params.token
  return (
    <main className="max-w-md mx-auto mt-24 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <form action={`/api/auth/reset?token=${token}`} method="post" className="space-y-3 mt-6">
        <div>
          <label className="text-sm">New Password</label>
          <input name="password" type="password" required className="w-full border rounded p-2" />
        </div>
        <button className="w-full rounded bg-gray-900 text-white py-2">Update password</button>
      </form>
      <div className="text-center mt-3"><Link href="/" className="underline text-sm">Back to sign in</Link></div>
    </main>
  )
}
