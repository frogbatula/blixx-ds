import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'UI/Dialog',
  tags: ['autodocs'],
  args: {},
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogDescription>
              This is a boilerplate dialog for the design team. Replace copy and
              wire to real actions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-foreground/70">
            Add forms, previews, or confirmations here.
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

