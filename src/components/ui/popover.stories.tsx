import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const meta = {
  title: 'UI/Popover',
  tags: ['autodocs'],
  args: {},
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold">Popover title</div>
            <div className="text-sm text-foreground/70">
              Boilerplate Popover content. Replace with real UI.
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

