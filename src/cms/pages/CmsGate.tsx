import { useState } from 'react'
import { CmsLogin } from '@/cms/components/CmsLogin'
import { isCmsAuthenticated } from '@/cms/lib/storage'
import { CmsLayout } from '@/cms/pages/CmsLayout'

export function CmsGate() {
  const [authed, setAuthed] = useState(() => isCmsAuthenticated())

  if (!authed) {
    return <CmsLogin onSuccess={() => setAuthed(true)} />
  }

  return <CmsLayout />
}
