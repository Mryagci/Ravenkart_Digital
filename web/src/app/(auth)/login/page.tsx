"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      router.push('/')
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-semibold">Giriş Yap</h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 rounded-md border bg-transparent" type="email" placeholder="E-posta" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="px-3 py-2 rounded-md border bg-transparent" type="password" placeholder="Şifre" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="px-4 py-2 rounded-md bg-brand-600 text-white disabled:opacity-60">{loading ? 'Giriş yapılıyor...' : 'Giriş'}</button>
        </form>
        <div className="mt-4 text-sm">
          <a href="/forgot-password" className="hover:underline">Şifremi unuttum</a>
        </div>
      </div>
    </main>
  )
}

