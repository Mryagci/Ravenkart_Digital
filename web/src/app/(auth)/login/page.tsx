export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-semibold">Giriş Yap</h1>
        <form className="mt-6 grid gap-4">
          <input className="px-3 py-2 rounded-md border bg-transparent" type="email" placeholder="E-posta" />
          <input className="px-3 py-2 rounded-md border bg-transparent" type="password" placeholder="Şifre" />
          <button className="px-4 py-2 rounded-md bg-brand-600 text-white">Giriş</button>
        </form>
      </div>
    </main>
  )
}

