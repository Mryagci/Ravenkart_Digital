export default function ScannerPage() {
  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Kart Tarayıcı & Galeri</h1>
        <div className="mt-6 grid gap-6">
          <section className="rounded-xl border p-4">
            <div className="aspect-video rounded-md border border-dashed grid place-items-center">Kamera Önizleme</div>
          </section>
          <section className="rounded-xl border p-4">
            <h2 className="font-medium">Galeri</h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="aspect-square rounded-md border" />
              <div className="aspect-square rounded-md border" />
              <div className="aspect-square rounded-md border" />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

