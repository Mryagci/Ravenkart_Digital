interface CardPageProps {
  params: { username: string }
}

export default function CardPage({ params }: CardPageProps) {
  const { username } = params
  return (
    <main className="min-h-screen">
      <section className="max-w-md mx-auto">
        <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800" />
        <div className="h-[30px] gradient-ribbon" />
        <div className="p-4 text-center">
          <h1 className="text-2xl font-semibold">{username}</h1>
          <p className="text-slate-600 dark:text-slate-300">Ünvan • Şirket</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mt-6">
            <div className="w-full h-40 rounded-xl border border-dashed grid place-items-center">QR Carousel</div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="aspect-square rounded-xl border" />
            <div className="aspect-square rounded-xl border" />
          </div>
        </div>
        <footer className="py-6 text-center text-sm text-slate-500">
          Powered by Ravenkart
        </footer>
      </section>
    </main>
  )
}

