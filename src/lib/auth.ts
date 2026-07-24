import { createContext, useContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './supabase'

export const CMS_ROLES = [
  'super_admin',
  'admin',
  'marketing',
  'designer',
  'casino_manager',
  'sports_manager',
] as const

export type CmsRole = (typeof CMS_ROLES)[number]

export const ROLE_LABELS: Record<CmsRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  marketing: 'Marketing',
  designer: 'Designer',
  casino_manager: 'Casino Manager',
  sports_manager: 'Sports Manager',
}

export type AuthState = {
  user: User | null
  session: Session | null
  role: CmsRole | null
  loading: boolean
  isAuthenticated: boolean
}

export type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isSuperAdmin: boolean
  isAdmin: boolean
  canManageTenants: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within CmsAuthProvider')
  }
  return ctx
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ user: User | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { user: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, error: error.message }
  }
  return { user: data.user, error: null }
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<{ user: User | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { user: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { user: null, error: error.message }
  }
  return { user: data.user, error: null }
}

export async function signOutUser(): Promise<void> {
  if (!isSupabaseConfigured) return
  await supabase.auth.signOut()
}

export async function getCurrentSession(): Promise<{
  user: User | null
  session: Session | null
}> {
  if (!isSupabaseConfigured) {
    return { user: null, session: null }
  }

  const { data } = await supabase.auth.getSession()
  return {
    user: data.session?.user ?? null,
    session: data.session,
  }
}

export function onAuthStateChange(
  callback: (user: User | null, session: Session | null) => void,
): () => void {
  if (!isSupabaseConfigured) {
    return () => {}
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null, session)
  })

  return () => data.subscription.unsubscribe()
}

export async function fetchUserRole(
  userId: string,
  tenantId = 'blixx-gaming',
): Promise<CmsRole | null> {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .single()

  if (error || !data) {
    console.error('fetchUserRole error:', error)
    return null
  }

  return data.role as CmsRole
}

export async function setUserRole(
  userId: string,
  role: CmsRole,
  tenantId = 'blixx-gaming',
): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const { error } = await supabase.from('user_roles').upsert({
    user_id: userId,
    tenant_id: tenantId,
    role,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error('setUserRole error:', error)
    return false
  }
  return true
}
