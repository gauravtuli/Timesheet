export default function Signup(){
  return (
    <main className="max-w-md mx-auto mt-24 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <p className="text-sm text-gray-600 mt-1">Restricted to @themavericksindia.com</p>
      <form action="/api/auth/signup" method="post" className="space-y-3 mt-6">
        <div>
          <label className="text-sm">Full Name</label>
          <input name="name" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input name="email" type="email" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input name="password" type="password" required className="w-full border rounded p-2" />
        </div>
        <button className="w-full rounded bg-gray-900 text-white py-2">Sign up</button>
      </form>
    </main>
  )
}
