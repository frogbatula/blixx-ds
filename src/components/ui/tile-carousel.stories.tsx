import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/app/AuthProvider'
import { TileCarousel, TileCarouselItem } from '@/components/ui/tile-carousel'
import { GameTile } from '@/components/ui/game-tile'
import { Button } from '@/components/ui/button'
import { homeGameCarousels } from '@/mock/homeGames'

const meta = {
  title: 'UI/TileCarousel',
  component: TileCarousel,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof TileCarousel>

export default meta
type Story = StoryObj<typeof meta>

const demo = homeGameCarousels[0]!

export const Default: Story = {
  args: {
    title: 'Popular games',
    description: 'Horizontal snap carousel of game tiles.',
    children: null,
  },
  render: () => (
    <TileCarousel
      title="Popular games"
      description="Scroll or use the arrows"
      action={
        <Button type="button" variant="ghost" size="sm">
          See all
        </Button>
      }
    >
      {demo.tiles.map((tile) => (
        <TileCarouselItem key={tile.id}>
          <GameTile
            className="w-full"
            gameId={tile.id}
            label={tile.label}
            subtitle={tile.subtitle}
            imageSrc={tile.imageSrc}
            imageAlt={tile.label}
          />
        </TileCarouselItem>
      ))}
    </TileCarousel>
  ),
}

export const MultipleRows: Story = {
  args: {
    title: 'Rows',
    children: null,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {homeGameCarousels.slice(0, 3).map((row) => (
        <TileCarousel key={row.id} title={row.id} description="Theme row">
          {row.tiles.map((tile) => (
            <TileCarouselItem key={tile.id}>
              <GameTile
                className="w-full"
                gameId={tile.id}
                label={tile.label}
                subtitle={tile.subtitle}
                imageSrc={tile.imageSrc}
              />
            </TileCarouselItem>
          ))}
        </TileCarousel>
      ))}
    </div>
  ),
}
