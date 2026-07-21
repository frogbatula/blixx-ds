import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'

const meta = {
  title: 'UI/Alert',
  tags: ['autodocs'],
  args: {},
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          Boilerplate alert UI for the design team.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Use variants to communicate states.</AlertDescription>
      </Alert>
    </div>
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <TriangleAlert className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>Something needs your attention.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Destructive</AlertTitle>
      <AlertDescription>This is how destructive alerts look.</AlertDescription>
    </Alert>
  ),
}

