"use client"
import { useEffect, useState } from 'react'

export function LanguageSwitcher() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr')

  useEffect(() => {
    const stored = window.localStorage.getItem('lang') as 'tr' | 'en' | null
    const initial = stored || 'tr'
    setLang(initial)
    document.documentElement.lang = initial
  }, [])

  function toggleLanguage() {
    const next = lang === 'tr' ? 'en' : 'tr'
    setLang(next)
    window.localStorage.setItem('lang', next)
    document.documentElement.lang = next
  }

  return (
    <button onClick={toggleLanguage} className="text-sm px-2 py-1 rounded-md border">
      {lang.toUpperCase()}
    </button>
  )
}

