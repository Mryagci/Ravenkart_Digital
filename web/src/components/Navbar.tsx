"use client"
import Link from 'next/link'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAuth } from '@/lib/auth/useAuth'

export function Navbar() {
  const { user, signOut } = useAuth()
  return (
    <nav className="fixed top-0 inset-x-0 glass z-50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Ravenkart</Link>
        <div className="flex items-center gap-3">
          <Link href="/editor" className="text-sm hover:underline">Dijital Kartı Düzenle</Link>
          <Link href="/card/me" className="text-sm hover:underline">Dijital Kartım</Link>
          <Link href="/pricing" className="text-sm hover:underline">Planlar</Link>
          <Link href="/admin" className="text-sm hover:underline">Admin</Link>
          <LanguageSwitcher />
          {user ? (
            <button onClick={signOut} className="text-sm">Çıkış</button>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm hover:underline">Giriş</Link>
              <Link href="/register" className="text-sm hover:underline">Kayıt Ol</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

