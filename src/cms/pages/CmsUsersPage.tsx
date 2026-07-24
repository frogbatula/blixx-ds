import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth, CMS_ROLES, ROLE_LABELS, setUserRole, type CmsRole } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, Shield, Trash2, UserPlus } from 'lucide-react'

type UserWithRole = {
  id: string
  email: string
  role: CmsRole | null
  created_at: string
}

export function CmsUsersPage() {
  const { isSuperAdmin } = useAuth()
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch all users from the cms_users view
      const { data, error } = await supabase
        .from('cms_users')
        .select('id, email, role, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to load users:', error)
        setStatus('Failed to load users')
        setLoading(false)
        return
      }

      const userList: UserWithRole[] = (data ?? []).map((u) => ({
        id: u.id,
        email: u.email ?? u.id,
        role: u.role as CmsRole | null,
        created_at: u.created_at,
      }))

      setUsers(userList)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  async function handleRoleChange(userId: string, newRole: CmsRole) {
    setSaving(userId)
    setStatus(null)
    const success = await setUserRole(userId, newRole)
    if (success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      )
      setStatus('Role updated')
    } else {
      setStatus('Failed to update role')
    }
    setSaving(null)
  }

  async function handleRemoveRole(userId: string) {
    setSaving(userId)
    setStatus(null)
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('tenant_id', 'blixx-gaming')

    if (error) {
      console.error('Failed to remove role:', error)
      setStatus('Failed to remove role')
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setStatus('User removed')
    }
    setSaving(null)
  }

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Shield className="mx-auto mb-2 size-8 text-foreground/30" />
          <p className="text-sm text-foreground/60">
            Only Super Admins can manage users.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 max-w-2xl text-sm text-foreground/70">
          Manage user access and roles for the CMS.
        </p>
      </div>

      {status && (
        <p className="rounded-xl bg-background-subtle px-3 py-2 text-sm text-foreground/80">
          {status}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users with Access</CardTitle>
          <CardDescription>
            Users with roles can access the CMS. Change or remove their roles here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-foreground/60">Loading users...</p>
          ) : users.filter((u) => u.role).length === 0 ? (
            <p className="text-sm text-foreground/60">
              No users have roles yet. Assign roles below to grant CMS access.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {users
                .filter((u) => u.role)
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border-muted bg-background-subtle p-3"
                  >
                    <User className="size-5 text-foreground/40" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-foreground/50">
                        Registered {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Select
                      value={user.role ?? ''}
                      onValueChange={(v) => handleRoleChange(user.id, v as CmsRole)}
                      disabled={saving === user.id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {CMS_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveRole(user.id)}
                      disabled={saving === user.id}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Users</CardTitle>
          <CardDescription>
            Registered users without a role. Assign a role to grant CMS access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-foreground/60">Loading...</p>
          ) : users.filter((u) => !u.role).length === 0 ? (
            <p className="text-sm text-foreground/60">
              No pending users. When new users register, they'll appear here.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {users
                .filter((u) => !u.role)
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border-muted bg-background-subtle p-3"
                  >
                    <UserPlus className="size-5 text-primary/60" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-foreground/50">
                        Registered {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <AssignRoleDropdown
                      userId={user.id}
                      onAssign={(role) => handleRoleChange(user.id, role)}
                      disabled={saving === user.id}
                    />
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AssignRoleDropdown({
  userId,
  onAssign,
  disabled,
}: {
  userId: string
  onAssign: (role: CmsRole) => void
  disabled?: boolean
}) {
  const [role, setRole] = useState<CmsRole | ''>('')

  function handleChange(value: string) {
    if (value && value !== '') {
      setRole(value as CmsRole)
      onAssign(value as CmsRole)
    }
  }

  return (
    <Select value={role} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Assign role..." />
      </SelectTrigger>
      <SelectContent>
        {CMS_ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {ROLE_LABELS[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
