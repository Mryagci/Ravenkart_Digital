"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/useAuth'

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [canUpdate, setCanUpdate] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCanUpdate(password.length >= 6 && password === confirm)
  }, [password, confirm])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canUpdate) return
    setLoading(true)
    setError(null)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) setError(error)
    else setSuccess('Şifreniz güncellendi. Artık giriş yapabilirsiniz.')
  }

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-semibold">Yeni Şifre Belirle</h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="px-3 py-2 rounded-md border bg-transparent" type="password" placeholder="Yeni Şifre" required />
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="px-3 py-2 rounded-md border bg-transparent" type="password" placeholder="Yeni Şifre (Tekrar)" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button disabled={!canUpdate || loading} className="px-4 py-2 rounded-md bg-brand-600 text-white disabled:opacity-60">{loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</button>
        </form>
      </div>
    </main>
  )
}

