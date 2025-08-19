export default function PricingPage() {
  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Planlar</h1>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold">Ücretsiz</h2>
            <p className="mt-2 text-sm">Sınırlı erişim</p>
            <div className="mt-4 text-3xl font-bold">$0</div>
          </div>
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold">Pro</h2>
            <p className="mt-2 text-sm">Tam erişim</p>
            <div className="mt-4 text-3xl font-bold">$2.5</div>
          </div>
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold">Kurumsal</h2>
            <p className="mt-2 text-sm">Esnek fiyat</p>
            <div className="mt-4 text-3xl font-bold">İletişime geçin</div>
          </div>
        </div>
      </div>
    </main>
  )
}

