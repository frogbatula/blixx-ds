import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="story-textarea">Notes</Label>
      <Textarea
        id="story-textarea"
        placeholder="Write something…"
        defaultValue="A short design-team note."
      />
    </div>
  ),
}

