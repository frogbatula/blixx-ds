import { Bold, Italic, Underline } from 'lucide-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from '@/components/ui/toggle'

const meta = {
  title: 'UI/Toggle',
  component: Toggle,
  tags: ['autodocs'],
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic" variant="outline">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline" defaultPressed>
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  ),
}
