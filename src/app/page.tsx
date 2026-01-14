'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase/client'
import { useRouter } from 'next/navigation'


export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return <div className="loading">⏳ กำลังโหลด...</div>
  }

  return (
    <div className="home-wrapper">
      <div className="home-card">
        <div className="logo">🌱</div>

        <h1 className="title">PlantCare</h1>
        <p className="subtitle">
          ระบบช่วยเตือนการรดน้ำต้นไม้<br />
          ดูแลต้นไม้ให้สดใสทุกวัน
        </p>

        {user ? (
          <>
            <div className="user-box">
              <p className="user-label">เข้าสู่ระบบแล้ว</p>
              <p className="user-email">{user.email}</p>
            </div>

            <button
              className="primary"
              onClick={() => router.push('/dashboard')}
            >
              🌿 ไปที่แดชบอร์ด
            </button>

            <button className="danger" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </>
        ) : (
          <>
            <button
              className="primary"
              onClick={() => router.push('/login')}
            >
              🔐 เข้าสู่ระบบ
            </button>

            <button
              className="secondary"
              onClick={() => router.push('/register')}
            >
              ✨ สมัครสมาชิก
            </button>
          </>
        )}
      </div>
    </div>
  )
}
