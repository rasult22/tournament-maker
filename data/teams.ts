export interface Team {
  id: string;
  name: string;
  shortName: string;
  league: League;
  country: string;
  colors: {
    primary: string;
    secondary: string;
  };
  rating: number; // 1-5 stars like FIFA
}

export type League =
  | 'premier_league'
  | 'la_liga'
  | 'bundesliga'
  | 'serie_a'
  | 'ligue_1'
  | 'other';

export interface LeagueInfo {
  id: League;
  name: string;
  country: string;
  flag: string;
}

export const LEAGUES: LeagueInfo[] = [
  { id: 'premier_league', name: 'Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'la_liga', name: 'La Liga', country: 'Spain', flag: '🇪🇸' },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', flag: '🇩🇪' },
  { id: 'serie_a', name: 'Serie A', country: 'Italy', flag: '🇮🇹' },
  { id: 'ligue_1', name: 'Ligue 1', country: 'France', flag: '🇫🇷' },
];

export const TEAMS: Team[] = [
  // PREMIER LEAGUE
  { id: 'mci', name: 'Manchester City', shortName: 'Man City', league: 'premier_league', country: 'England', colors: { primary: '#6CABDD', secondary: '#1C2C5B' }, rating: 5 },
  { id: 'ars', name: 'Arsenal', shortName: 'Arsenal', league: 'premier_league', country: 'England', colors: { primary: '#EF0107', secondary: '#FFFFFF' }, rating: 5 },
  { id: 'liv', name: 'Liverpool', shortName: 'Liverpool', league: 'premier_league', country: 'England', colors: { primary: '#C8102E', secondary: '#00B2A9' }, rating: 5 },
  { id: 'mun', name: 'Manchester United', shortName: 'Man Utd', league: 'premier_league', country: 'England', colors: { primary: '#DA291C', secondary: '#FBE122' }, rating: 4.5 },
  { id: 'che', name: 'Chelsea', shortName: 'Chelsea', league: 'premier_league', country: 'England', colors: { primary: '#034694', secondary: '#DBA111' }, rating: 4.5 },
  { id: 'tot', name: 'Tottenham Hotspur', shortName: 'Spurs', league: 'premier_league', country: 'England', colors: { primary: '#132257', secondary: '#FFFFFF' }, rating: 4 },
  { id: 'new', name: 'Newcastle United', shortName: 'Newcastle', league: 'premier_league', country: 'England', colors: { primary: '#241F20', secondary: '#FFFFFF' }, rating: 4 },
  { id: 'avl', name: 'Aston Villa', shortName: 'Aston Villa', league: 'premier_league', country: 'England', colors: { primary: '#670E36', secondary: '#95BFE5' }, rating: 4 },
  { id: 'bha', name: 'Brighton & Hove Albion', shortName: 'Brighton', league: 'premier_league', country: 'England', colors: { primary: '#0057B8', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'whu', name: 'West Ham United', shortName: 'West Ham', league: 'premier_league', country: 'England', colors: { primary: '#7A263A', secondary: '#1BB1E7' }, rating: 3.5 },
  { id: 'cry', name: 'Crystal Palace', shortName: 'Crystal Palace', league: 'premier_league', country: 'England', colors: { primary: '#1B458F', secondary: '#C4122E' }, rating: 3.5 },
  { id: 'bre', name: 'Brentford', shortName: 'Brentford', league: 'premier_league', country: 'England', colors: { primary: '#E30613', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'ful', name: 'Fulham', shortName: 'Fulham', league: 'premier_league', country: 'England', colors: { primary: '#FFFFFF', secondary: '#000000' }, rating: 3.5 },
  { id: 'wol', name: 'Wolverhampton Wanderers', shortName: 'Wolves', league: 'premier_league', country: 'England', colors: { primary: '#FDB913', secondary: '#231F20' }, rating: 3.5 },
  { id: 'eve', name: 'Everton', shortName: 'Everton', league: 'premier_league', country: 'England', colors: { primary: '#003399', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'bou', name: 'AFC Bournemouth', shortName: 'Bournemouth', league: 'premier_league', country: 'England', colors: { primary: '#DA291C', secondary: '#000000' }, rating: 3 },
  { id: 'nfo', name: 'Nottingham Forest', shortName: "Nott'm Forest", league: 'premier_league', country: 'England', colors: { primary: '#DD0000', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'lei', name: 'Leicester City', shortName: 'Leicester', league: 'premier_league', country: 'England', colors: { primary: '#003090', secondary: '#FDBE11' }, rating: 3.5 },
  { id: 'ips', name: 'Ipswich Town', shortName: 'Ipswich', league: 'premier_league', country: 'England', colors: { primary: '#0033A0', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'sou', name: 'Southampton', shortName: 'Southampton', league: 'premier_league', country: 'England', colors: { primary: '#D71920', secondary: '#FFFFFF' }, rating: 3 },

  // LA LIGA
  { id: 'rma', name: 'Real Madrid', shortName: 'Real Madrid', league: 'la_liga', country: 'Spain', colors: { primary: '#FFFFFF', secondary: '#FEBE10' }, rating: 5 },
  { id: 'fcb', name: 'FC Barcelona', shortName: 'Barcelona', league: 'la_liga', country: 'Spain', colors: { primary: '#A50044', secondary: '#004D98' }, rating: 5 },
  { id: 'atm', name: 'Atlético Madrid', shortName: 'Atlético', league: 'la_liga', country: 'Spain', colors: { primary: '#CB3524', secondary: '#FFFFFF' }, rating: 4.5 },
  { id: 'sev', name: 'Sevilla FC', shortName: 'Sevilla', league: 'la_liga', country: 'Spain', colors: { primary: '#FFFFFF', secondary: '#D4021D' }, rating: 4 },
  { id: 'rso', name: 'Real Sociedad', shortName: 'Real Sociedad', league: 'la_liga', country: 'Spain', colors: { primary: '#0067B1', secondary: '#FFFFFF' }, rating: 4 },
  { id: 'vil', name: 'Villarreal CF', shortName: 'Villarreal', league: 'la_liga', country: 'Spain', colors: { primary: '#FFE114', secondary: '#005DAA' }, rating: 4 },
  { id: 'ath', name: 'Athletic Bilbao', shortName: 'Athletic', league: 'la_liga', country: 'Spain', colors: { primary: '#EE2523', secondary: '#FFFFFF' }, rating: 4 },
  { id: 'bet', name: 'Real Betis', shortName: 'Betis', league: 'la_liga', country: 'Spain', colors: { primary: '#00954C', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'val', name: 'Valencia CF', shortName: 'Valencia', league: 'la_liga', country: 'Spain', colors: { primary: '#FFFFFF', secondary: '#EE3524' }, rating: 3.5 },
  { id: 'gir', name: 'Girona FC', shortName: 'Girona', league: 'la_liga', country: 'Spain', colors: { primary: '#CD2534', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'osa', name: 'CA Osasuna', shortName: 'Osasuna', league: 'la_liga', country: 'Spain', colors: { primary: '#D91A21', secondary: '#0A346F' }, rating: 3 },
  { id: 'get', name: 'Getafe CF', shortName: 'Getafe', league: 'la_liga', country: 'Spain', colors: { primary: '#004FA3', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'cel', name: 'RC Celta', shortName: 'Celta', league: 'la_liga', country: 'Spain', colors: { primary: '#8AC3EE', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'ray', name: 'Rayo Vallecano', shortName: 'Rayo', league: 'la_liga', country: 'Spain', colors: { primary: '#FFFFFF', secondary: '#E53027' }, rating: 3 },
  { id: 'mal', name: 'RCD Mallorca', shortName: 'Mallorca', league: 'la_liga', country: 'Spain', colors: { primary: '#E20613', secondary: '#000000' }, rating: 3 },
  { id: 'esp', name: 'RCD Espanyol', shortName: 'Espanyol', league: 'la_liga', country: 'Spain', colors: { primary: '#007FC8', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'las', name: 'UD Las Palmas', shortName: 'Las Palmas', league: 'la_liga', country: 'Spain', colors: { primary: '#FFE400', secondary: '#0033A0' }, rating: 3 },
  { id: 'ala', name: 'Deportivo Alavés', shortName: 'Alavés', league: 'la_liga', country: 'Spain', colors: { primary: '#0033A1', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'leg', name: 'CD Leganés', shortName: 'Leganés', league: 'la_liga', country: 'Spain', colors: { primary: '#0033A1', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'vll', name: 'Real Valladolid', shortName: 'Valladolid', league: 'la_liga', country: 'Spain', colors: { primary: '#6E2A6E', secondary: '#FFFFFF' }, rating: 3 },

  // BUNDESLIGA
  { id: 'bay', name: 'Bayern Munich', shortName: 'Bayern', league: 'bundesliga', country: 'Germany', colors: { primary: '#DC052D', secondary: '#0066B2' }, rating: 5 },
  { id: 'bvb', name: 'Borussia Dortmund', shortName: 'Dortmund', league: 'bundesliga', country: 'Germany', colors: { primary: '#FDE100', secondary: '#000000' }, rating: 4.5 },
  { id: 'rbl', name: 'RB Leipzig', shortName: 'Leipzig', league: 'bundesliga', country: 'Germany', colors: { primary: '#DD0741', secondary: '#FFFFFF' }, rating: 4.5 },
  { id: 'b04', name: 'Bayer Leverkusen', shortName: 'Leverkusen', league: 'bundesliga', country: 'Germany', colors: { primary: '#E32221', secondary: '#000000' }, rating: 4.5 },
  { id: 'sge', name: 'Eintracht Frankfurt', shortName: 'Frankfurt', league: 'bundesliga', country: 'Germany', colors: { primary: '#E1000F', secondary: '#000000' }, rating: 4 },
  { id: 'vfb', name: 'VfB Stuttgart', shortName: 'Stuttgart', league: 'bundesliga', country: 'Germany', colors: { primary: '#E32219', secondary: '#FFFFFF' }, rating: 4 },
  { id: 'bmg', name: 'Borussia Mönchengladbach', shortName: 'Gladbach', league: 'bundesliga', country: 'Germany', colors: { primary: '#000000', secondary: '#18A950' }, rating: 3.5 },
  { id: 'wob', name: 'VfL Wolfsburg', shortName: 'Wolfsburg', league: 'bundesliga', country: 'Germany', colors: { primary: '#65B32E', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'scf', name: 'SC Freiburg', shortName: 'Freiburg', league: 'bundesliga', country: 'Germany', colors: { primary: '#000000', secondary: '#E2001A' }, rating: 3.5 },
  { id: 'tsg', name: 'TSG Hoffenheim', shortName: 'Hoffenheim', league: 'bundesliga', country: 'Germany', colors: { primary: '#1961B5', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'fca', name: 'FC Augsburg', shortName: 'Augsburg', league: 'bundesliga', country: 'Germany', colors: { primary: '#BA3733', secondary: '#00572E' }, rating: 3 },
  { id: 'svw', name: 'Werder Bremen', shortName: 'Bremen', league: 'bundesliga', country: 'Germany', colors: { primary: '#1D9053', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'boc', name: 'VfL Bochum', shortName: 'Bochum', league: 'bundesliga', country: 'Germany', colors: { primary: '#005BA5', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'fcm', name: '1. FC Heidenheim', shortName: 'Heidenheim', league: 'bundesliga', country: 'Germany', colors: { primary: '#E30613', secondary: '#00386C' }, rating: 3 },
  { id: 'fcu', name: '1. FC Union Berlin', shortName: 'Union Berlin', league: 'bundesliga', country: 'Germany', colors: { primary: '#EB1923', secondary: '#FDE607' }, rating: 3.5 },
  { id: 'm05', name: '1. FSV Mainz 05', shortName: 'Mainz', league: 'bundesliga', country: 'Germany', colors: { primary: '#ED1C24', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'koe', name: '1. FC Köln', shortName: 'Köln', league: 'bundesliga', country: 'Germany', colors: { primary: '#ED1C24', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'hbs', name: 'Hamburger SV', shortName: 'Hamburg', league: 'bundesliga', country: 'Germany', colors: { primary: '#0A1E96', secondary: '#FFFFFF' }, rating: 3.5 },

  // SERIE A
  { id: 'int', name: 'Inter Milan', shortName: 'Inter', league: 'serie_a', country: 'Italy', colors: { primary: '#0068A8', secondary: '#000000' }, rating: 4.5 },
  { id: 'acm', name: 'AC Milan', shortName: 'Milan', league: 'serie_a', country: 'Italy', colors: { primary: '#FB090B', secondary: '#000000' }, rating: 4.5 },
  { id: 'juv', name: 'Juventus', shortName: 'Juventus', league: 'serie_a', country: 'Italy', colors: { primary: '#000000', secondary: '#FFFFFF' }, rating: 4.5 },
  { id: 'nap', name: 'SSC Napoli', shortName: 'Napoli', league: 'serie_a', country: 'Italy', colors: { primary: '#12A0D7', secondary: '#FFFFFF' }, rating: 4.5 },
  { id: 'rom', name: 'AS Roma', shortName: 'Roma', league: 'serie_a', country: 'Italy', colors: { primary: '#8E1F2F', secondary: '#F0BC42' }, rating: 4 },
  { id: 'laz', name: 'SS Lazio', shortName: 'Lazio', league: 'serie_a', country: 'Italy', colors: { primary: '#87D8F7', secondary: '#FFFFFF' }, rating: 4 },
  { id: 'ata', name: 'Atalanta', shortName: 'Atalanta', league: 'serie_a', country: 'Italy', colors: { primary: '#1E71B8', secondary: '#000000' }, rating: 4 },
  { id: 'fio', name: 'ACF Fiorentina', shortName: 'Fiorentina', league: 'serie_a', country: 'Italy', colors: { primary: '#482E92', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'tor', name: 'Torino FC', shortName: 'Torino', league: 'serie_a', country: 'Italy', colors: { primary: '#8B0000', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'bol', name: 'Bologna FC', shortName: 'Bologna', league: 'serie_a', country: 'Italy', colors: { primary: '#A52A2A', secondary: '#1E3E77' }, rating: 3.5 },
  { id: 'mon', name: 'AC Monza', shortName: 'Monza', league: 'serie_a', country: 'Italy', colors: { primary: '#AC0019', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'udi', name: 'Udinese', shortName: 'Udinese', league: 'serie_a', country: 'Italy', colors: { primary: '#000000', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'sas', name: 'US Sassuolo', shortName: 'Sassuolo', league: 'serie_a', country: 'Italy', colors: { primary: '#00A850', secondary: '#000000' }, rating: 3 },
  { id: 'emp', name: 'Empoli FC', shortName: 'Empoli', league: 'serie_a', country: 'Italy', colors: { primary: '#005BA5', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'cag', name: 'Cagliari', shortName: 'Cagliari', league: 'serie_a', country: 'Italy', colors: { primary: '#A42032', secondary: '#16377C' }, rating: 3 },
  { id: 'lec', name: 'US Lecce', shortName: 'Lecce', league: 'serie_a', country: 'Italy', colors: { primary: '#FFED00', secondary: '#E31E24' }, rating: 3 },
  { id: 'gen', name: 'Genoa CFC', shortName: 'Genoa', league: 'serie_a', country: 'Italy', colors: { primary: '#A6192E', secondary: '#00287A' }, rating: 3 },
  { id: 'ver', name: 'Hellas Verona', shortName: 'Verona', league: 'serie_a', country: 'Italy', colors: { primary: '#FFCC00', secondary: '#003D7A' }, rating: 3 },
  { id: 'par', name: 'Parma Calcio', shortName: 'Parma', league: 'serie_a', country: 'Italy', colors: { primary: '#FFED00', secondary: '#0D47A1' }, rating: 3 },
  { id: 'ven', name: 'Venezia FC', shortName: 'Venezia', league: 'serie_a', country: 'Italy', colors: { primary: '#FF6600', secondary: '#000000' }, rating: 3 },

  // LIGUE 1
  { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', league: 'ligue_1', country: 'France', colors: { primary: '#004170', secondary: '#DA291C' }, rating: 5 },
  { id: 'ol', name: 'Olympique Lyon', shortName: 'Lyon', league: 'ligue_1', country: 'France', colors: { primary: '#FFFFFF', secondary: '#DA291C' }, rating: 4 },
  { id: 'om', name: 'Olympique Marseille', shortName: 'Marseille', league: 'ligue_1', country: 'France', colors: { primary: '#FFFFFF', secondary: '#2FAEE0' }, rating: 4 },
  { id: 'mon', name: 'AS Monaco', shortName: 'Monaco', league: 'ligue_1', country: 'France', colors: { primary: '#DA291C', secondary: '#FFFFFF' }, rating: 4 },
  { id: 'lil', name: 'LOSC Lille', shortName: 'Lille', league: 'ligue_1', country: 'France', colors: { primary: '#DA291C', secondary: '#FFFFFF' }, rating: 3.5 },
  { id: 'nic', name: 'OGC Nice', shortName: 'Nice', league: 'ligue_1', country: 'France', colors: { primary: '#000000', secondary: '#DA291C' }, rating: 3.5 },
  { id: 'ren', name: 'Stade Rennais', shortName: 'Rennes', league: 'ligue_1', country: 'France', colors: { primary: '#DA291C', secondary: '#000000' }, rating: 3.5 },
  { id: 'len', name: 'RC Lens', shortName: 'Lens', league: 'ligue_1', country: 'France', colors: { primary: '#FFE400', secondary: '#E32219' }, rating: 3.5 },
  { id: 'srfc', name: 'RC Strasbourg', shortName: 'Strasbourg', league: 'ligue_1', country: 'France', colors: { primary: '#009FE3', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'nan', name: 'FC Nantes', shortName: 'Nantes', league: 'ligue_1', country: 'France', colors: { primary: '#FCD116', secondary: '#007848' }, rating: 3 },
  { id: 'sb29', name: 'Stade Brestois', shortName: 'Brest', league: 'ligue_1', country: 'France', colors: { primary: '#E32219', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'rei', name: 'Stade de Reims', shortName: 'Reims', league: 'ligue_1', country: 'France', colors: { primary: '#DA291C', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'tou', name: 'Toulouse FC', shortName: 'Toulouse', league: 'ligue_1', country: 'France', colors: { primary: '#51327D', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'mon', name: 'Montpellier HSC', shortName: 'Montpellier', league: 'ligue_1', country: 'France', colors: { primary: '#003D7A', secondary: '#FF6600' }, rating: 3 },
  { id: 'aux', name: 'AJ Auxerre', shortName: 'Auxerre', league: 'ligue_1', country: 'France', colors: { primary: '#FFFFFF', secondary: '#003D7A' }, rating: 3 },
  { id: 'ang', name: 'Angers SCO', shortName: 'Angers', league: 'ligue_1', country: 'France', colors: { primary: '#FFFFFF', secondary: '#000000' }, rating: 3 },
  { id: 'hav', name: 'Le Havre AC', shortName: 'Le Havre', league: 'ligue_1', country: 'France', colors: { primary: '#009FE3', secondary: '#FFFFFF' }, rating: 3 },
  { id: 'ste', name: 'AS Saint-Étienne', shortName: 'Saint-Étienne', league: 'ligue_1', country: 'France', colors: { primary: '#007848', secondary: '#FFFFFF' }, rating: 3 },
];

// Get teams sorted by rating (like FIFA)
export function getTeamsByRating(): Team[] {
  return [...TEAMS].sort((a, b) => b.rating - a.rating);
}

// Get teams by league
export function getTeamsByLeague(league: League): Team[] {
  return TEAMS.filter(t => t.league === league).sort((a, b) => b.rating - a.rating);
}

// Search teams
export function searchTeams(query: string): Team[] {
  const q = query.toLowerCase();
  return TEAMS.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.shortName.toLowerCase().includes(q)
  ).sort((a, b) => b.rating - a.rating);
}

// Get team by ID
export function getTeamById(id: string): Team | undefined {
  return TEAMS.find(t => t.id === id);
}
