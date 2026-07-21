import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const meta = {
  title: 'UI/Avatar',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://api.dicebear.com/9.x/shapes/svg?seed=blixx" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>K</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarFallback className="text-base">AB</AvatarFallback>
      </Avatar>
    </div>
  ),
}
