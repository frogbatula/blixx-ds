import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="story-input">Email</Label>
      <Input id="story-input" placeholder="you@example.com" />
    </div>
  ),
}
