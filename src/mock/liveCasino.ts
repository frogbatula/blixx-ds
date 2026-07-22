import type { MockGameCarousel } from '@/mock/homeGames'

function tileImage(seed: string) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1a1a2e,16213e,0f3460,533483`
}

export const liveCasinoCarousels: MockGameCarousel[] = [
  {
    id: 'roulette',
    titleKey: 'live.carousels.roulette',
    descriptionKey: 'live.carousels.rouletteBody',
    tiles: [
      { id: 'r1', label: 'Lightning Roulette', subtitle: 'Evolution', imageSrc: tileImage('live-lightning') },
      { id: 'r2', label: 'Immersive Roulette', subtitle: 'Evolution', imageSrc: tileImage('live-immersive') },
      { id: 'r3', label: 'Speed Roulette', subtitle: 'Evolution', imageSrc: tileImage('live-speed-roulette') },
      { id: 'r4', label: 'Auto Roulette', subtitle: 'Evolution', imageSrc: tileImage('live-auto') },
      { id: 'r5', label: 'XXXtreme Lightning', subtitle: 'Evolution', imageSrc: tileImage('live-xxxtreme') },
      { id: 'r6', label: 'French Roulette', subtitle: 'Evolution', imageSrc: tileImage('live-french') },
    ],
  },
  {
    id: 'blackjack',
    titleKey: 'live.carousels.blackjack',
    descriptionKey: 'live.carousels.blackjackBody',
    tiles: [
      { id: 'b1', label: 'Blackjack VIP', subtitle: 'Live', imageSrc: tileImage('live-bj-vip') },
      { id: 'b2', label: 'Infinite Blackjack', subtitle: 'Live', imageSrc: tileImage('live-bj-infinite') },
      { id: 'b3', label: 'Speed Blackjack', subtitle: 'Live', imageSrc: tileImage('live-bj-speed') },
      { id: 'b4', label: 'Party Blackjack', subtitle: 'Live', imageSrc: tileImage('live-bj-party') },
      { id: 'b5', label: 'Free Bet Blackjack', subtitle: 'Live', imageSrc: tileImage('live-bj-free') },
      { id: 'b6', label: 'Power Blackjack', subtitle: 'Live', imageSrc: tileImage('live-bj-power') },
    ],
  },
  {
    id: 'game-shows',
    titleKey: 'live.carousels.gameShows',
    descriptionKey: 'live.carousels.gameShowsBody',
    tiles: [
      { id: 'g1', label: 'Crazy Ball', subtitle: 'Game show', imageSrc: tileImage('live-crazy-ball') },
      { id: 'g2', label: 'Crazy Time', subtitle: 'Game show', imageSrc: tileImage('live-crazy-time') },
      { id: 'g3', label: 'Monopoly Live', subtitle: 'Game show', imageSrc: tileImage('live-monopoly') },
      { id: 'g4', label: 'Dream Catcher', subtitle: 'Game show', imageSrc: tileImage('live-dream') },
      { id: 'g5', label: 'Deal or No Deal', subtitle: 'Game show', imageSrc: tileImage('live-dond') },
      { id: 'g6', label: 'Mega Ball', subtitle: 'Game show', imageSrc: tileImage('live-mega-ball') },
    ],
  },
  {
    id: 'baccarat',
    titleKey: 'live.carousels.baccarat',
    descriptionKey: 'live.carousels.baccaratBody',
    tiles: [
      { id: 'c1', label: 'Studio Baccarat', subtitle: 'Live', imageSrc: tileImage('live-bac-studio') },
      { id: 'c2', label: 'Speed Baccarat', subtitle: 'Live', imageSrc: tileImage('live-bac-speed') },
      { id: 'c3', label: 'No Commission', subtitle: 'Live', imageSrc: tileImage('live-bac-nc') },
      { id: 'c4', label: 'Squeeze Baccarat', subtitle: 'Live', imageSrc: tileImage('live-bac-squeeze') },
      { id: 'c5', label: 'Prosperity Tree', subtitle: 'Live', imageSrc: tileImage('live-bac-prosperity') },
    ],
  },
]
