'use client'
import { useEffect, useMemo, useState } from 'react'

type Client = { id: string, name: string, isActive: boolean }
type Row = {
  clientId: string
  details: string
  month: string
  actualHours: number
  nextMonthProjectedHours: number
}

export default function TimesheetMultiForm({ clients, defaultMonth }:{clients: Client[], defaultMonth: string}){
  const [rows, setRows] = useState<Row[]>([
    { clientId: clients[0]?.id || '', details: '', month: defaultMonth, actualHours: 0, nextMonthProjectedHours: 0 }
  ])
  const workingHours = 160

  const totals = useMemo(() => {
    const total = rows.reduce((acc, r) => acc + (Number(r.actualHours) || 0), 0)
    const utilization = workingHours ? Math.min(100, Math.round((total / workingHours) * 100)) : 0
    return { total, utilization }
  }, [rows])

  function updateRow(i:number, k:keyof Row, v:any){
    setRows(rs => rs.map((r, idx) => idx===i ? {...r, [k]: v} : r))
  }

  function addRow(){
    setRows(rs => [...rs, { clientId: clients[0]?.id || '', details:'', month: defaultMonth, actualHours: 0, nextMonthProjectedHours: 0 }])
  }

  function removeRow(i:number){
    setRows(rs => rs.filter((_, idx) => idx!==i))
  }

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault()
    const res = await fetch('/api/timesheets/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: rows })
    })
    if(!res.ok){ alert('Failed to save'); return }
    window.location.reload()
  }

  return (
    <div className="space-y-3">
      <div className="rounded border p-3 bg-white">
        <div className="flex justify-between items-center">
          <div className="text-sm">This month total: <b>{totals.total.toFixed(1)}</b> hrs</div>
          <div className="text-sm">% Utilization (160h): <b>{totals.utilization}%</b></div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="overflow-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Client</th>
                <th className="p-2 text-left">Details</th>
                <th className="p-2 text-left">Month</th>
                <th className="p-2 text-left">Actual Hours</th>
                <th className="p-2 text-left">Next Month Projection</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">
                    <select className="border p-2 rounded w-48" value={r.clientId} onChange={e=>updateRow(i,'clientId',e.target.value)}>
                      {clients.filter(c=>c.isActive).map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                  </td>
                  <td className="p-2">
                    <textarea className="border p-2 rounded w-64" value={r.details} onChange={e=>updateRow(i,'details',e.target.value)} placeholder="Work details"></textarea>
                  </td>
                  <td className="p-2">
                    <input className="border p-2 rounded w-28" type="month" value={r.month} onChange={e=>updateRow(i,'month',e.target.value)} />
                  </td>
                  <td className="p-2">
                    <input className="border p-2 rounded w-28" type="number" min="0" step="0.1" value={r.actualHours} onChange={e=>updateRow(i,'actualHours',Number(e.target.value))} />
                  </td>
                  <td className="p-2">
                    <input className="border p-2 rounded w-28" type="number" min="0" step="0.1" value={r.nextMonthProjectedHours} onChange={e=>updateRow(i,'nextMonthProjectedHours',Number(e.target.value))} />
                  </td>
                  <td className="p-2">
                    <button type="button" className="text-red-600" onClick={()=>removeRow(i)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={addRow} className="px-3 py-1 rounded border">+ Add Row</button>
          <button type="submit" className="px-3 py-1 rounded bg-gray-900 text-white">Save Entries</button>
        </div>
      </form>
    </div>
  )
}
