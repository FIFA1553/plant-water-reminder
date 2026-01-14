'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('สมัครสมาชิกสำเร็จ 🎉 กรุณาเข้าสู่ระบบ')
      setTimeout(() => {
        router.push('/login') // ✅ สมัครเสร็จ → ไปหน้า Login
      }, 1500)
    }

    setLoading(false)
  }

  return (
    <main style={{ padding: 40 }}>
      <h2>📝 สมัครสมาชิก</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password (อย่างน้อย 6 ตัว)"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <hr style={{ margin: '20px 0' }} />

      {/* 🔁 กลับไปหน้า Login */}
      <button
  type="button"
  onClick={() => router.push('/login')}
>
  กลับไปหน้าเข้าสู่ระบบ
</button>

    </main>
  )
}
