import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  AuthContext,
  type AuthState,
  getCurrentSession,
  onAuthStateChange,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  fetchUserRole,
} from '@/lib/auth'

export function CmsAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    loading: true,
    isAuthenticated: false,
  })

  const loadRole = useCallback(async (user: User | null) => {
    if (!user) return null
    return fetchUserRole(user.id)
  }, [])

  useEffect(() => {
    // Get initial session and role
    getCurrentSession().then(async ({ user, session }) => {
      const role = await loadRole(user)
      setState({
        user,
        session,
        role,
        loading: false,
        isAuthenticated: !!user,
      })
    })

    // Listen for auth changes
    const unsubscribe = onAuthStateChange(async (user, session) => {
      const role = await loadRole(user)
      setState({
        user,
        session,
        role,
        loading: false,
        isAuthenticated: !!user,
      })
    })

    return unsubscribe
  }, [loadRole])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await signInWithEmail(email, password)
    return { error }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await signUpWithEmail(email, password)
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    await signOutUser()
  }, [])

  const permissions = useMemo(() => {
    const isSuperAdmin = state.role === 'super_admin'
    const isAdmin = state.role === 'admin' || isSuperAdmin
    const canManageTenants = isSuperAdmin
    return { isSuperAdmin, isAdmin, canManageTenants }
  }, [state.role])

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, ...permissions }}>
      {children}
    </AuthContext.Provider>
  )
}
