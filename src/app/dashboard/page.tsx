import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import Nav from '@/components/Nav'
import TimesheetMultiForm from '@/components/TimesheetMultiForm'
import TimesheetChart from '@/components/TimesheetChart'

export default async function Dashboard(){
  const token = cookies().get('mt_auth')?.value || ''
  const secret = process.env.JWT_SECRET || 'dev-secret'
  const session = jwt.verify(token, secret) as any
  const me = await prisma.user.findUnique({ where: { id: session.userId } })
  const clients = await prisma.client.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
  const entries = await prisma.timesheetEntry.findMany({ where: { userId: session.userId }, include: { client: true }, orderBy: [{ month: 'desc' }, { createdAt: 'desc' }] })
  const defaultMonth = new Date().toISOString().slice(0,7)

  const chartData = Object.values(entries.reduce((acc: any, e) => {
    const k = e.client.name
    acc[k] = acc[k] || { name: k, hours: 0 }
    acc[k].hours += e.actualHours
    return acc
  }, {}))

  return (
    <div>
      <Nav role={me?.role as any} />
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="bg-white p-4 rounded border">
          <h2 className="text-xl font-semibold mb-3">Add Timesheet Entries</h2>
          <TimesheetMultiForm clients={clients as any} defaultMonth={defaultMonth} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border">
            <h3 className="font-medium mb-2">My Entries</h3>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Month</th>
                    <th className="p-2 text-left">Client</th>
                    <th className="p-2 text-left">Details</th>
                    <th className="p-2 text-left">Actual</th>
                    <th className="p-2 text-left">Next Mo. Proj.</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(e => (
                    <tr key={e.id} className="border-t">
                      <td className="p-2">{e.month}</td>
                      <td className="p-2">{e.client.name}</td>
                      <td className="p-2">{e.details}</td>
                      <td className="p-2">{e.actualHours}</td>
                      <td className="p-2">{e.nextMonthProjectedHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <TimesheetChart data={chartData as any} />
        </div>
      </main>
    </div>
  )
}
