import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-4xl px-4 pt-24 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Modern Dijital Kartınız</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">QR ve NFC ile paylaşılabilir, her zaman güncel, şık ve etkileşimli.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/editor" className="px-5 py-3 rounded-lg bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow transition-transform hover:scale-[1.02]">Dijital Kartı Düzenle</Link>
            <Link href="/card/me" className="px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700">Dijital Kartım</Link>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">Basit • Hızlı • Şık</div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">QR Taramaları: 0</div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">Çok dilli destek</div>
          </div>
        </div>
      </section>
      <footer className="py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} Ravenkart</footer>
    </main>
  )
}

