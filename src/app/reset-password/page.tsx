export default function ResetRequest(){
  return (
    <main className="max-w-md mx-auto mt-24 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold">Reset your password</h1>
      <p className="text-sm text-gray-600 mt-1">Enter your work email and we'll send a reset link.</p>
      <form action="/api/auth/request-reset" method="post" className="space-y-3 mt-6">
        <div>
          <label className="text-sm">Email</label>
          <input name="email" type="email" required className="w-full border rounded p-2" />
        </div>
        <button className="w-full rounded bg-gray-900 text-white py-2">Send reset link</button>
      </form>
    </main>
  )
}
