import { Tournament, PlayerStats } from '../types';

export interface GlobalPlayerStats extends PlayerStats {
  tournaments: number;
  titles: number;
}

// Расчёт глобальной статистики игрока по всем турнирам
export function calculateGlobalStats(tournaments: Tournament[]): GlobalPlayerStats[] {
  const statsMap = new Map<string, GlobalPlayerStats>();

  tournaments.forEach(tournament => {
    tournament.players.forEach(player => {
      if (!statsMap.has(player.id)) {
        statsMap.set(player.id, {
          playerId: player.id,
          playerName: player.name,
          gamesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          winRate: 0,
          tournaments: 0,
          titles: 0,
        });
      }

      const stats = statsMap.get(player.id)!;
      stats.tournaments++;

      // Обновляем имя на случай если менялось
      stats.playerName = player.name;
    });

    // Обработка матчей
    tournament.matches
      .filter(m => m.status === 'finished' && m.score1 !== undefined && m.score2 !== undefined)
      .filter(m => m.player1Id !== 'bye' && m.player2Id !== 'bye' && m.player1Id !== 'tbd' && m.player2Id !== 'tbd')
      .forEach(match => {
        const stats1 = statsMap.get(match.player1Id);
        const stats2 = statsMap.get(match.player2Id);

        if (!stats1 || !stats2) return;

        stats1.gamesPlayed++;
        stats2.gamesPlayed++;
        stats1.goalsFor += match.score1!;
        stats1.goalsAgainst += match.score2!;
        stats2.goalsFor += match.score2!;
        stats2.goalsAgainst += match.score1!;

        if (match.score1! > match.score2!) {
          stats1.wins++;
          stats2.losses++;
        } else if (match.score1! < match.score2!) {
          stats2.wins++;
          stats1.losses++;
        } else {
          stats1.draws++;
          stats2.draws++;
        }
      });

    // Подсчёт титулов
    if (tournament.status === 'finished') {
      const winnerId = getWinnerId(tournament);
      if (winnerId) {
        const winnerStats = statsMap.get(winnerId);
        if (winnerStats) {
          winnerStats.titles++;
        }
      }
    }
  });

  // Финальные расчёты
  const result = Array.from(statsMap.values()).map(stats => ({
    ...stats,
    goalDifference: stats.goalsFor - stats.goalsAgainst,
    points: stats.wins * 3 + stats.draws,
    winRate: stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0,
  }));

  // Сортировка по винрейту, потом по количеству игр
  result.sort((a, b) => {
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    return b.gamesPlayed - a.gamesPlayed;
  });

  return result;
}

function getWinnerId(tournament: Tournament): string | null {
  if (tournament.type === 'league') {
    // Для лиги победитель - тот кто набрал больше очков
    const standings = calculateLeagueStandings(tournament);
    return standings[0]?.playerId || null;
  }

  // Для плей-офф и комбинированного - победитель финала
  const maxRound = Math.max(...tournament.matches.map(m => m.round));
  const finalMatch = tournament.matches.find(m => m.round === maxRound && m.status === 'finished');

  if (finalMatch) {
    return finalMatch.score1! > finalMatch.score2!
      ? finalMatch.player1Id
      : finalMatch.player2Id;
  }

  return null;
}

function calculateLeagueStandings(tournament: Tournament) {
  const statsMap = new Map<string, { playerId: string; points: number; goalDiff: number }>();

  tournament.players.forEach(p => {
    statsMap.set(p.id, { playerId: p.id, points: 0, goalDiff: 0 });
  });

  tournament.matches
    .filter(m => m.status === 'finished')
    .forEach(match => {
      const s1 = statsMap.get(match.player1Id);
      const s2 = statsMap.get(match.player2Id);
      if (!s1 || !s2) return;

      s1.goalDiff += (match.score1! - match.score2!);
      s2.goalDiff += (match.score2! - match.score1!);

      if (match.score1! > match.score2!) {
        s1.points += 3;
      } else if (match.score1! < match.score2!) {
        s2.points += 3;
      } else {
        s1.points += 1;
        s2.points += 1;
      }
    });

  return Array.from(statsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goalDiff - a.goalDiff;
  });
}
