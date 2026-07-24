import { useState } from 'react'
import { CmsAuthProvider } from '@/cms/CmsAuthProvider'
import { CmsAuthLogin } from '@/cms/components/CmsAuthLogin'
import { CmsLogin } from '@/cms/components/CmsLogin'
import { CmsPendingApproval } from '@/cms/components/CmsPendingApproval'
import { isCmsAuthenticated } from '@/cms/lib/storage'
import { CmsLayout } from '@/cms/pages/CmsLayout'
import { isSupabaseConfigured } from '@/lib/db'
import { useAuth } from '@/lib/auth'

function CmsGateInner() {
  const { isAuthenticated, loading, role, user, signOut } = useAuth()
  const [passcodeAuthed, setPasscodeAuthed] = useState(() => isCmsAuthenticated())

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-foreground/60">Loading...</p>
      </div>
    )
  }

  // If Supabase auth is configured, use it
  if (isSupabaseConfigured) {
    if (!isAuthenticated) {
      return <CmsAuthLogin />
    }
    // User is authenticated but has no role assigned
    if (!role) {
      return <CmsPendingApproval email={user?.email} onSignOut={signOut} />
    }
    return <CmsLayout />
  }

  // Fallback to passcode auth
  if (!passcodeAuthed) {
    return <CmsLogin onSuccess={() => setPasscodeAuthed(true)} />
  }

  return <CmsLayout />
}

export function CmsGate() {
  return (
    <CmsAuthProvider>
      <CmsGateInner />
    </CmsAuthProvider>
  )
}
