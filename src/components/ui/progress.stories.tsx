import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from '@/components/ui/progress'

const meta = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={33} />
      <Progress value={66} />
      <Progress value={100} />
    </div>
  ),
}
