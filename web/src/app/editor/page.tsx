export default function EditorPage() {
  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Dijital Kart Düzenleyici</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Profil fotoğrafı, şirket logosu ve sosyal linkleri ekleyin.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="rounded-xl border p-4">
            <h2 className="font-medium">Profil</h2>
            <div className="mt-4 grid gap-3">
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="Ad Soyad" />
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="Ünvan" />
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="Şirket" />
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="Telefon" />
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="E-posta" />
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="Web Sitesi" />
            </div>
          </section>
          <section className="rounded-xl border p-4">
            <h2 className="font-medium">Sosyal Medya</h2>
            <div className="mt-4 grid gap-3">
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="LinkedIn kullanıcı adı" />
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="Instagram kullanıcı adı" />
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="Twitter kullanıcı adı" />
            </div>
          </section>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 rounded-md bg-brand-600 text-white">Kaydet (.vcf)</button>
          <button className="px-4 py-2 rounded-md border">Ana Ekrana Ekle</button>
        </div>
      </div>
    </main>
  )
}

