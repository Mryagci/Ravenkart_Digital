"use client"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<{ error?: string }>
  updatePassword: (newPassword: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return {}
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo }
    })
    if (error) return { error: error.message }
    return {}
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const sendPasswordReset = useCallback(async (email: string) => {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) return { error: error.message }
    return {}
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    return {}
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    updatePassword,
  }), [user, session, loading, signIn, signUp, signOut, sendPasswordReset, updatePassword])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

