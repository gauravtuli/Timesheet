'use client'
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts'

export default function TimesheetChart({ data }:{data: { name: string, hours: number }[]}){
  return (
    <div className="w-full h-72 border rounded p-3 bg-white">
      <h3 className="font-medium mb-2">Hours by Client</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
