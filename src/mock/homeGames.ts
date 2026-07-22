import type { GameTileAspect } from '@/components/ui/game-tile'

export type MockGameTile = {
  id: string
  label: string
  subtitle: string
  imageSrc?: string
}

export type MockGameCarousel = {
  id: string
  titleKey: string
  descriptionKey?: string
  /** Tile frame ratio for this row; defaults to 4/3 landscape. */
  tileAspect?: GameTileAspect
  tiles: MockGameTile[]
}

function tileImage(seed: string) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1a1a2e,16213e,0f3460,533483`
}

export const homeGameCarousels: MockGameCarousel[] = [
  {
    id: 'popular',
    titleKey: 'home.carousels.popular',
    descriptionKey: 'home.carousels.popularBody',
    tiles: [
      { id: 'p1', label: 'Neon Spins', subtitle: 'NetEnt', imageSrc: tileImage('neon-spins') },
      { id: 'p2', label: 'Lucky Rails', subtitle: 'Pragmatic', imageSrc: tileImage('lucky-rails') },
      { id: 'p3', label: 'Gold Rush', subtitle: 'Play\'n GO', imageSrc: tileImage('gold-rush') },
      { id: 'p4', label: 'Star Cascade', subtitle: 'Hacksaw', imageSrc: tileImage('star-cascade') },
      { id: 'p5', label: 'Wild Circuit', subtitle: 'Relax', imageSrc: tileImage('wild-circuit') },
      { id: 'p6', label: 'Fortune Hub', subtitle: 'Evolution', imageSrc: tileImage('fortune-hub') },
      { id: 'p7', label: 'Blitz Coins', subtitle: 'Nolimit', imageSrc: tileImage('blitz-coins') },
      { id: 'p8', label: 'Pixel Jack', subtitle: 'Push', imageSrc: tileImage('pixel-jack') },
    ],
  },
  {
    id: 'slots',
    titleKey: 'home.carousels.slots',
    descriptionKey: 'home.carousels.slotsBody',
    tiles: [
      { id: 's1', label: 'Sugar Drop', subtitle: 'Slots', imageSrc: tileImage('sugar-drop') },
      { id: 's2', label: 'Temple Fire', subtitle: 'Slots', imageSrc: tileImage('temple-fire') },
      { id: 's3', label: 'Frost Reels', subtitle: 'Slots', imageSrc: tileImage('frost-reels') },
      { id: 's4', label: 'Mega Fruit', subtitle: 'Slots', imageSrc: tileImage('mega-fruit') },
      { id: 's5', label: 'Crystal Run', subtitle: 'Slots', imageSrc: tileImage('crystal-run') },
      { id: 's6', label: 'Book of Blixx', subtitle: 'Slots', imageSrc: tileImage('book-of-blixx') },
      { id: 's7', label: 'Rocket Pay', subtitle: 'Slots', imageSrc: tileImage('rocket-pay') },
    ],
  },
  {
    id: 'live',
    titleKey: 'home.carousels.live',
    descriptionKey: 'home.carousels.liveBody',
    tileAspect: '3/4',
    tiles: [
      { id: 'l1', label: 'Lightning Roulette', subtitle: 'Live', imageSrc: tileImage('lightning-roulette') },
      { id: 'l2', label: 'Blackjack VIP', subtitle: 'Live', imageSrc: tileImage('blackjack-vip') },
      { id: 'l3', label: 'Crazy Ball', subtitle: 'Live', imageSrc: tileImage('crazy-ball') },
      { id: 'l4', label: 'Studio Baccarat', subtitle: 'Live', imageSrc: tileImage('studio-baccarat') },
      { id: 'l5', label: 'Game Show Night', subtitle: 'Live', imageSrc: tileImage('game-show') },
      { id: 'l6', label: 'Speed Poker', subtitle: 'Live', imageSrc: tileImage('speed-poker') },
    ],
  },
  {
    id: 'jackpots',
    titleKey: 'home.carousels.jackpots',
    descriptionKey: 'home.carousels.jackpotsBody',
    tiles: [
      { id: 'j1', label: 'Mega Pot', subtitle: 'Jackpot', imageSrc: tileImage('mega-pot') },
      { id: 'j2', label: 'Daily Drop', subtitle: 'Jackpot', imageSrc: tileImage('daily-drop') },
      { id: 'j3', label: 'Network Gold', subtitle: 'Jackpot', imageSrc: tileImage('network-gold') },
      { id: 'j4', label: 'Hourly Hit', subtitle: 'Jackpot', imageSrc: tileImage('hourly-hit') },
      { id: 'j5', label: 'Crown Pool', subtitle: 'Jackpot', imageSrc: tileImage('crown-pool') },
      { id: 'j6', label: 'Skyline Jack', subtitle: 'Jackpot', imageSrc: tileImage('skyline-jack') },
    ],
  },
  {
    id: 'new',
    titleKey: 'home.carousels.new',
    descriptionKey: 'home.carousels.newBody',
    tiles: [
      { id: 'n1', label: 'Fresh Spin', subtitle: 'New', imageSrc: tileImage('fresh-spin') },
      { id: 'n2', label: 'Orbit Wins', subtitle: 'New', imageSrc: tileImage('orbit-wins') },
      { id: 'n3', label: 'Velvet Dice', subtitle: 'New', imageSrc: tileImage('velvet-dice') },
      { id: 'n4', label: 'Arcade Ace', subtitle: 'New', imageSrc: tileImage('arcade-ace') },
      { id: 'n5', label: 'Night Market', subtitle: 'New', imageSrc: tileImage('night-market') },
      { id: 'n6', label: 'Pulse Grid', subtitle: 'New', imageSrc: tileImage('pulse-grid') },
      { id: 'n7', label: 'Echo Reels', subtitle: 'New', imageSrc: tileImage('echo-reels') },
    ],
  },
  {
    id: 'table',
    titleKey: 'home.carousels.table',
    descriptionKey: 'home.carousels.tableBody',
    tiles: [
      { id: 't1', label: 'European Roulette', subtitle: 'Table', imageSrc: tileImage('eu-roulette') },
      { id: 't2', label: 'Classic Blackjack', subtitle: 'Table', imageSrc: tileImage('classic-bj') },
      { id: 't3', label: 'Casino Hold\'em', subtitle: 'Table', imageSrc: tileImage('holdem') },
      { id: 't4', label: 'Three Card Poker', subtitle: 'Table', imageSrc: tileImage('tcp') },
      { id: 't5', label: 'Sic Bo', subtitle: 'Table', imageSrc: tileImage('sic-bo') },
      { id: 't6', label: 'Caribbean Stud', subtitle: 'Table', imageSrc: tileImage('caribbean') },
    ],
  },
]
