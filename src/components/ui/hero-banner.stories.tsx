import type { Meta, StoryObj } from '@storybook/react-vite'
import { HeroBanner } from '@/components/ui/hero-banner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const meta = {
  title: 'UI/HeroBanner',
  component: HeroBanner,
  tags: ['autodocs'],
  args: {
    title: '200 free spins on your first deposit',
    description: 'Deposit & play with fast withdrawals. Demo hero for Blixx DS.',
    size: 'lg',
    headingLevel: 'h1',
  },
} satisfies Meta<typeof HeroBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Gradient: Story = {
  args: {
    eyebrow: (
      <>
        <Badge>Kanuuna</Badge>
        <Badge variant="secondary">Promo</Badge>
      </>
    ),
    actions: (
      <>
        <Button size="lg">Play now</Button>
        <Button variant="secondary" size="lg">
          Promotions
        </Button>
      </>
    ),
  },
}

export const WithImage: Story = {
  args: {
    imageSrc:
      'https://api.dicebear.com/9.x/shapes/svg?seed=hero&backgroundColor=0a0a0a',
    imageAlt: 'Promotional artwork',
    eyebrow: <Badge variant="info">Featured</Badge>,
    actions: <Button size="lg">Claim offer</Button>,
  },
}

export const Compact: Story = {
  args: {
    size: 'sm',
    title: 'Weekend reload',
    description: 'Extra spins every Friday.',
    headingLevel: 'h2',
    actions: <Button size="sm">Learn more</Button>,
  },
}
