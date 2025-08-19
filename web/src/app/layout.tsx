import type { Metadata } from 'next'
import { clsx } from 'clsx'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { AuthProvider } from '@/lib/auth/useAuth'

export const metadata: Metadata = {
  title: 'Ravenkart',
  description: 'Digital business cards with QR/NFC',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={clsx('min-h-screen antialiased')}>
        <AuthProvider>
          <Navbar />
          <div className="pt-14">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}

