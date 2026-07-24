import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Props = {
  email?: string | null
  onSignOut: () => void
}

export function CmsPendingApproval({ email, onSignOut }: Props) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-xl">Access Pending</CardTitle>
          <CardDescription>
            Your account is awaiting approval
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-foreground/70">
            You've signed in as <strong>{email}</strong>, but you don't have a
            role assigned yet.
          </p>
          <p className="text-sm text-foreground/70">
            Please contact a Super Admin to grant you access to the CMS.
          </p>
          <Button variant="outline" onClick={onSignOut}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
