import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const meta = {
  title: 'UI/Sheet',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Right: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="secondary">Open sheet</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Sheet title</SheetTitle>
            <SheetDescription>
              Slide-over panel boilerplate for filters, menus, or mobile nav.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 text-sm text-foreground/75">
            Replace with real content.
          </div>
          <SheetFooter>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  },
}

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Bottom sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[50vh]">
        <SheetHeader>
          <SheetTitle>Mobile-style sheet</SheetTitle>
          <SheetDescription>Useful for mobile filter panels.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}
