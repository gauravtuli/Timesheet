// src/app/admin/page.tsx
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// This is a Server Component that fetches data during rendering
export default async function AdminPage() {
  let data = []

  try {
    // Fetch TimesheetEntry data from the database
    // Adjusting to fetch all timesheet entries, with related user and client data
    data = await prisma.timesheetEntry.findMany({
      include: {
        user: true,   // Include related user data
        client: true, // Include related client data
      },
    })
  } catch (error) {
    console.error("Error fetching data:", error)
    data = []  // Fallback to empty array in case of an error
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h3>Data Fetched from Database:</h3>
      {/* Display the data fetched from the database */}
      <pre>{JSON.stringify(data, null, 2)}</pre>  
    </div>
  )
}
