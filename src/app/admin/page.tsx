// src/app/admin/page.tsx
import { PrismaClient } from '@prisma/client'

// Prisma Client instance
const prisma = new PrismaClient()

// This is a Server Component that fetches data during rendering
export default async function AdminPage() {
  // Fetch data from the database when the page is rendered
  let data = []

  try {
    // Use Prisma to fetch the data from your database
    data = await prisma.someModel.findMany()  // Replace `someModel` with your actual model name
  } catch (error) {
    console.error("Error fetching data:", error)
    data = []  // Fallback to empty array in case of an error
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h3>Data Fetched from Database:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>  {/* Display the fetched data */}
    </div>
  )
}
