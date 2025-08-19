"use client"
import { useState } from 'react'
import { useAuth } from '@/lib/auth/useAuth'

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const { error } = await sendPasswordReset(email)
    setLoading(false)
    if (error) setError(error)
    else setSuccess('Eğer hesap varsa, şifre sıfırlama e-postası gönderildi.')
  }

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-semibold">Şifre Sıfırla</h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 rounded-md border bg-transparent" type="email" placeholder="E-posta" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button disabled={loading} className="px-4 py-2 rounded-md bg-brand-600 text-white disabled:opacity-60">{loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}</button>
        </form>
      </div>
    </main>
  )
}

