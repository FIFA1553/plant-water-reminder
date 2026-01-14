'use client'

import { useParams } from 'next/navigation'

export default function PlantDetailPage() {
  const params = useParams()
  const id = params.id

  return (
    <main style={{ padding: 20 }}>
      <h1>🌱 รายละเอียดต้นไม้</h1>
      <p>Plant ID: {id}</p>
    </main>
  )
}
