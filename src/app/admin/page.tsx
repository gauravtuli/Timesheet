import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import Nav from '@/components/Nav'

async function getData(){
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } })
  const entries = await prisma.timesheetEntry.findMany({ include: { user: true, client: true }, orderBy: [{ month: 'desc' }, { createdAt: 'desc' }] })
  const settings = await prisma.setting.findMany()
  return { clients, users, entries, settings }
}

export default async function AdminPage(){
  const data = await getData()
  const frontendEnabled = data.settings.find(s=>s.key==='frontend_enabled')?.value !== 'false'

  return (
    <div>
      <Nav role="ADMIN" />
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <section className="bg-white p-4 rounded border space-y-3">
          <h2 className="text-xl font-semibold">Settings</h2>
          <form action="/api/settings/toggle" method="post" className="flex items-center gap-3">
            <input type="hidden" name="enabled" value={frontendEnabled ? 'false' : 'true'} />
            <span>Timesheet Frontend: <b>{frontendEnabled ? 'Enabled' : 'Disabled'}</b></span>
            <button className="px-3 py-1 rounded border">Toggle</button>
          </form>
        </section>

        <section className="bg-white p-4 rounded border space-y-3">
          <h2 className="text-xl font-semibold">Clients</h2>
          <form action="/api/clients/create" method="post" className="flex gap-2">
            <input name="name" placeholder="Add new client name" className="border rounded p-2" required />
            <button className="px-3 py-1 rounded bg-gray-900 text-white">Add</button>
          </form>
          <div className="grid md:grid-cols-2 gap-2">
            {data.clients.map(c => (
              <div key={c.id} className="p-2 border rounded flex justify-between items-center">
                <div><b>{c.name}</b> <span className="text-xs ml-2">{c.isActive ? 'active' : 'inactive'}</span></div>
                <div className="flex gap-2">
                  <form action="/api/clients/toggle" method="post">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="px-2 py-1 border rounded">{c.isActive ? 'Deactivate' : 'Activate'}</button>
                  </form>
                  <form action="/api/clients/delete" method="post" onSubmit={(e)=>{ if(!confirm('Delete client?')) e.preventDefault()}}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="px-2 py-1 border rounded text-red-600">Delete</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-4 rounded border space-y-3">
          <h2 className="text-xl font-semibold">All Entries</h2>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Month</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Client</th>
                  <th className="p-2 text-left">Details</th>
                  <th className="p-2 text-left">Actual</th>
                  <th className="p-2 text-left">Next Mo. Proj.</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map(e => (
                  <tr key={e.id} className="border-t">
                    <td className="p-2">{e.month}</td>
                    <td className="p-2">{e.user.name}</td>
                    <td className="p-2">{e.client.name}</td>
                    <td className="p-2">{e.details}</td>
                    <td className="p-2">{e.actualHours}</td>
                    <td className="p-2">{e.nextMonthProjectedHours}</td>
                    <td className="p-2">
                      <form action="/api/timesheets/delete" method="post" onSubmit={(ev)=>{ if(!confirm('Delete entry?')) ev.preventDefault()}}>
                        <input type="hidden" name="id" value={e.id} />
                        <button className="text-red-600 underline">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
