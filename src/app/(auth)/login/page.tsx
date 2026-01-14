'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabase/client'


export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    if (data.session) {
      router.push('/dashboard')
    }

    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/dashboard` },
    })
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* LOGO */}
        <div className="logo">
          🌿
        </div>

        <h1 className="title">PlantCare</h1>
        <p className="subtitle">Welcome back, let’s care your plants</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div className="password-box">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && <p className="error">❌ {error}</p>}

          <button className="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="social google" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <p className="footer">
          No account?{' '}
          <Link href="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
