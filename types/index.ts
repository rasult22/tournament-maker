export interface Player {
  id: string;
  name: string;
  avatar?: string;
  teamId?: string; // ID команды из data/teams.ts
}

export type TournamentType = 'league' | 'playoff' | 'league_playoff';
export type TournamentStatus = 'active' | 'finished';
export type MatchStatus = 'pending' | 'finished';

export interface Match {
  id: string;
  player1Id: string;
  player2Id: string;
  score1?: number;
  score2?: number;
  round: number;
  group?: string;
  status: MatchStatus;
}

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  players: Player[];
  matches: Match[];
  status: TournamentStatus;
  createdAt: number;
  // Для league_playoff - сколько игроков выходит в плей-офф
  playoffQualifiers?: number;
  // Текущая фаза для league_playoff
  phase?: 'league' | 'playoff';
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  winRate: number;
}

export interface StandingsRow extends PlayerStats {
  position: number;
}
