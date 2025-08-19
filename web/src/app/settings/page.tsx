export default function SettingsPage() {
  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Ayarlar</h1>
        <div className="mt-6 grid gap-6">
          <section className="rounded-xl border p-4">
            <h2 className="font-medium">Tema</h2>
            <div className="mt-3 flex gap-3">
              <button className="px-4 py-2 rounded-md border">Açık</button>
              <button className="px-4 py-2 rounded-md border">Koyu</button>
            </div>
          </section>
          <section className="rounded-xl border p-4">
            <h2 className="font-medium">Şerit (Gradient)</h2>
            <div className="mt-3 grid gap-3">
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="Başlangıç rengi" />
              <input className="px-3 py-2 rounded-md border bg-transparent" placeholder="Bitiş rengi" />
              <div className="h-8 rounded-md gradient-ribbon" />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

