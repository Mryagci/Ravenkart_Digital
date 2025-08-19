export default function AdminPage() {
  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border p-4">
            <h2 className="font-medium">Kullanıcıları Toplu Oluştur</h2>
            <button className="mt-3 px-4 py-2 rounded-md bg-brand-600 text-white">Excel Şablonunu İndir</button>
          </div>
          <div className="rounded-xl border p-4">
            <h2 className="font-medium">Yükleme Geçmişi</h2>
            <div className="mt-3 text-sm text-slate-500">Henüz veri yok</div>
          </div>
          <div className="rounded-xl border p-4">
            <h2 className="font-medium">Abonelikler</h2>
            <div className="mt-3 text-sm text-slate-500">Toplu indirme ve yönetim yakında</div>
          </div>
        </div>
      </div>
    </main>
  )
}

