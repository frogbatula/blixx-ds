import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from '@/components/ui/toast'

const meta = {
  title: 'UI/Toast',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Toaster />
      <Button variant="secondary" onClick={() => toast('Hello from sonner!')}>
        Show success toast
      </Button>
      <Button variant="outline" onClick={() => toast.error('Something went wrong')}>
        Show error toast
      </Button>
    </div>
  ),
}

