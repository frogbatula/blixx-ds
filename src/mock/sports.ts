export type SportsEvent = {
  id: string
  league: string
  home: string
  away: string
  kickoff: string
  markets: {
    home: string
    draw?: string
    away: string
  }
}

export type SportsSection = {
  id: string
  titleKey: string
  descriptionKey?: string
  events: SportsEvent[]
}

export const sportsSections: SportsSection[] = [
  {
    id: 'featured',
    titleKey: 'sports.sections.featured',
    descriptionKey: 'sports.sections.featuredBody',
    events: [
      {
        id: 'f1',
        league: 'Premier League',
        home: 'Arsenal',
        away: 'Chelsea',
        kickoff: 'Sat 15:00',
        markets: { home: '2.10', draw: '3.40', away: '3.50' },
      },
      {
        id: 'f2',
        league: 'La Liga',
        home: 'Real Madrid',
        away: 'Barcelona',
        kickoff: 'Sun 21:00',
        markets: { home: '2.45', draw: '3.30', away: '2.90' },
      },
      {
        id: 'f3',
        league: 'NBA',
        home: 'Lakers',
        away: 'Celtics',
        kickoff: 'Tonight 02:30',
        markets: { home: '1.85', away: '1.95' },
      },
    ],
  },
  {
    id: 'football',
    titleKey: 'sports.sections.football',
    descriptionKey: 'sports.sections.footballBody',
    events: [
      {
        id: 'fb1',
        league: 'Serie A',
        home: 'Inter',
        away: 'Milan',
        kickoff: 'Sun 18:00',
        markets: { home: '2.20', draw: '3.20', away: '3.40' },
      },
      {
        id: 'fb2',
        league: 'Bundesliga',
        home: 'Bayern',
        away: 'Dortmund',
        kickoff: 'Sat 17:30',
        markets: { home: '1.70', draw: '4.00', away: '4.50' },
      },
      {
        id: 'fb3',
        league: 'Allsvenskan',
        home: 'AIK',
        away: 'Hammarby',
        kickoff: 'Mon 19:00',
        markets: { home: '2.35', draw: '3.25', away: '3.00' },
      },
      {
        id: 'fb4',
        league: 'Veikkausliiga',
        home: 'HJK',
        away: 'KuPS',
        kickoff: 'Fri 18:00',
        markets: { home: '1.95', draw: '3.40', away: '3.80' },
      },
    ],
  },
  {
    id: 'tennis',
    titleKey: 'sports.sections.tennis',
    descriptionKey: 'sports.sections.tennisBody',
    events: [
      {
        id: 'tn1',
        league: 'ATP',
        home: 'Alcaraz',
        away: 'Sinner',
        kickoff: 'Today 14:00',
        markets: { home: '1.90', away: '1.90' },
      },
      {
        id: 'tn2',
        league: 'WTA',
        home: 'Świątek',
        away: 'Gauff',
        kickoff: 'Today 16:30',
        markets: { home: '1.65', away: '2.25' },
      },
      {
        id: 'tn3',
        league: 'ATP',
        home: 'Djokovic',
        away: 'Medvedev',
        kickoff: 'Tomorrow 13:00',
        markets: { home: '1.75', away: '2.10' },
      },
    ],
  },
  {
    id: 'ice-hockey',
    titleKey: 'sports.sections.iceHockey',
    descriptionKey: 'sports.sections.iceHockeyBody',
    events: [
      {
        id: 'ih1',
        league: 'NHL',
        home: 'Maple Leafs',
        away: 'Canadiens',
        kickoff: 'Tonight 01:00',
        markets: { home: '1.80', draw: '4.20', away: '2.15' },
      },
      {
        id: 'ih2',
        league: 'Liiga',
        home: 'Tappara',
        away: 'HIFK',
        kickoff: 'Sat 17:00',
        markets: { home: '2.05', draw: '3.80', away: '3.10' },
      },
      {
        id: 'ih3',
        league: 'SHL',
        home: 'Färjestad',
        away: 'Frölunda',
        kickoff: 'Thu 19:00',
        markets: { home: '2.15', draw: '3.70', away: '2.95' },
      },
    ],
  },
]
