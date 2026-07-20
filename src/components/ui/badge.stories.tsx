import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/components/ui/badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { variant: 'default' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Success: Story = { args: { variant: 'success' } }
export const Info: Story = { args: { variant: 'info' } }
export const Warning: Story = { args: { variant: 'warning' } }
export const Destructive: Story = { args: { variant: 'destructive' } }
export const Outline: Story = { args: { variant: 'outline' } }
