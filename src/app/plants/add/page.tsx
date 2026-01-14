'use client'
import { supabase } from '@/src/lib/supabase/client'

export default function AddPlantPage() {
  const addPlant = async () => {
    const { data: user } = await supabase.auth.getUser()

    await supabase.from('plants').insert({
      name: 'ต้นมะลิ',
      location: 'หน้าบ้าน',
      water_interval: 3,
      last_watered: new Date(),
      user_id: user.user?.id,
    })
  }

  return (
    <main>
      <button onClick={addPlant}>เพิ่มต้นไม้</button>
    </main>
  )
}
