// src/app/admin/page.tsx
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// getServerSideProps is used for Server-Side Rendering (SSR)
export async function getServerSideProps() {
  try {
    // Fetch data from the database at runtime (when the page is requested)
    const data = await prisma.someModel.findMany()  // Replace `someModel` with your actual model

    return {
      props: {
        data,  // Pass the fetched data to the page component
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)

    // Handle errors, like DB connection failures or query errors
    return {
      props: {
        data: [],  // Return an empty array or appropriate fallback data
      },
    }
  }
}

export default function AdminPage({ data }) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h3>Data Fetched from Database:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>  {/* Display the data */}
    </div>
  )
}
