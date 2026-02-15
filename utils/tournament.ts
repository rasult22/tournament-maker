import { Match, Player, PlayerStats, StandingsRow, Tournament } from '../types';
import { generateId } from './generateId';

// Генерация матчей для лиги (круговой турнир)
export function generateLeagueMatches(players: Player[]): Match[] {
  const matches: Match[] = [];
  const n = players.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      matches.push({
        id: generateId(),
        player1Id: players[i].id,
        player2Id: players[j].id,
        round: 1,
        status: 'pending',
      });
    }
  }

  return shuffleArray(matches);
}

// Генерация сетки плей-офф
export function generatePlayoffMatches(players: Player[]): Match[] {
  const matches: Match[] = [];
  const n = players.length;

  // Находим ближайшую степень двойки
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(n)));
  const byes = bracketSize - n;

  // Перемешиваем игроков
  const shuffled = shuffleArray([...players]);

  // Количество раундов
  const totalRounds = Math.log2(bracketSize);

  // Первый раунд
  let round1Players: (Player | null)[] = [];

  // Распределяем bye (автоматический проход)
  for (let i = 0; i < bracketSize; i++) {
    if (i < byes) {
      round1Players.push(null); // bye
    } else {
      round1Players.push(shuffled[i - byes] || null);
    }
  }

  // Создаём матчи первого раунда
  for (let i = 0; i < bracketSize / 2; i++) {
    const p1 = round1Players[i * 2];
    const p2 = round1Players[i * 2 + 1];

    if (p1 && p2) {
      matches.push({
        id: generateId(),
        player1Id: p1.id,
        player2Id: p2.id,
        round: 1,
        status: 'pending',
      });
    } else if (p1 || p2) {
      // Bye - игрок автоматически проходит дальше
      // Создаём placeholder матч для следующего раунда
      const advancingPlayer = p1 || p2;
      matches.push({
        id: generateId(),
        player1Id: advancingPlayer!.id,
        player2Id: 'bye',
        score1: 1,
        score2: 0,
        round: 1,
        status: 'finished',
      });
    }
  }

  // Создаём placeholder матчи для следующих раундов
  let matchesInRound = bracketSize / 4;
  for (let round = 2; round <= totalRounds; round++) {
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        id: generateId(),
        player1Id: 'tbd',
        player2Id: 'tbd',
        round,
        status: 'pending',
      });
    }
    matchesInRound = matchesInRound / 2;
  }

  return matches;
}

// Обновление плей-офф сетки после матча
export function updatePlayoffBracket(matches: Match[], finishedMatchId: string): Match[] {
  const updatedMatches = [...matches];
  const finishedMatch = updatedMatches.find(m => m.id === finishedMatchId);

  if (!finishedMatch || finishedMatch.status !== 'finished') {
    return updatedMatches;
  }

  const winnerId = finishedMatch.score1! > finishedMatch.score2!
    ? finishedMatch.player1Id
    : finishedMatch.player2Id;

  // Находим матчи текущего раунда
  const currentRoundMatches = updatedMatches.filter(m => m.round === finishedMatch.round);
  const matchIndex = currentRoundMatches.indexOf(finishedMatch);

  // Находим следующий раунд
  const nextRoundMatches = updatedMatches.filter(m => m.round === finishedMatch.round + 1);

  if (nextRoundMatches.length > 0) {
    // Определяем в какой матч следующего раунда попадает победитель
    const nextMatchIndex = Math.floor(matchIndex / 2);
    const nextMatch = nextRoundMatches[nextMatchIndex];

    if (nextMatch) {
      // Определяем слот (player1 или player2)
      if (matchIndex % 2 === 0) {
        nextMatch.player1Id = winnerId;
      } else {
        nextMatch.player2Id = winnerId;
      }
    }
  }

  return updatedMatches;
}

// Расчёт таблицы для лиги
export function calculateStandings(tournament: Tournament): StandingsRow[] {
  const statsMap = new Map<string, PlayerStats>();

  // Инициализация статистики для всех игроков
  tournament.players.forEach(player => {
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
    });
  });

  // Обработка завершённых матчей
  tournament.matches
    .filter(m => m.status === 'finished' && m.score1 !== undefined && m.score2 !== undefined)
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
        stats1.points += 3;
        stats2.losses++;
      } else if (match.score1! < match.score2!) {
        stats2.wins++;
        stats2.points += 3;
        stats1.losses++;
      } else {
        stats1.draws++;
        stats2.draws++;
        stats1.points += 1;
        stats2.points += 1;
      }
    });

  // Расчёт производных значений
  const standings: StandingsRow[] = Array.from(statsMap.values()).map(stats => ({
    ...stats,
    goalDifference: stats.goalsFor - stats.goalsAgainst,
    winRate: stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0,
    position: 0,
  }));

  // Сортировка: очки -> разница мячей -> забитые мячи
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  // Присвоение позиций
  standings.forEach((row, index) => {
    row.position = index + 1;
  });

  return standings;
}

// Переход от лиги к плей-офф для комбинированного формата
export function transitionToPlayoff(tournament: Tournament): Tournament {
  if (tournament.type !== 'league_playoff' || tournament.phase !== 'league') {
    return tournament;
  }

  const standings = calculateStandings(tournament);
  const qualifiers = tournament.playoffQualifiers || 4;
  const qualifiedPlayers = standings
    .slice(0, qualifiers)
    .map(s => tournament.players.find(p => p.id === s.playerId)!)
    .filter(Boolean);

  const playoffMatches = generatePlayoffMatches(qualifiedPlayers);

  return {
    ...tournament,
    phase: 'playoff',
    matches: [...tournament.matches, ...playoffMatches],
  };
}

// Проверка завершения турнира
export function checkTournamentCompletion(tournament: Tournament): boolean {
  if (tournament.type === 'league') {
    return tournament.matches.every(m => m.status === 'finished');
  }

  if (tournament.type === 'playoff') {
    const finalMatch = tournament.matches.find(m => {
      const roundMatches = tournament.matches.filter(rm => rm.round === m.round);
      return roundMatches.length === 1;
    });
    return finalMatch?.status === 'finished';
  }

  if (tournament.type === 'league_playoff') {
    if (tournament.phase === 'league') {
      const leagueMatches = tournament.matches.filter(m => !m.group?.startsWith('playoff'));
      return leagueMatches.every(m => m.status === 'finished');
    }
    const playoffMatches = tournament.matches.filter(m => m.group?.startsWith('playoff') || m.round > 0);
    const finalMatch = playoffMatches.find(m => {
      const roundMatches = playoffMatches.filter(rm => rm.round === m.round);
      return roundMatches.length === 1;
    });
    return finalMatch?.status === 'finished';
  }

  return false;
}

// Получение победителя
export function getTournamentWinner(tournament: Tournament): Player | null {
  if (tournament.status !== 'finished') return null;

  if (tournament.type === 'league') {
    const standings = calculateStandings(tournament);
    if (standings.length > 0) {
      return tournament.players.find(p => p.id === standings[0].playerId) || null;
    }
  }

  if (tournament.type === 'playoff' || tournament.type === 'league_playoff') {
    const maxRound = Math.max(...tournament.matches.map(m => m.round));
    const finalMatch = tournament.matches.find(m => m.round === maxRound && m.status === 'finished');
    if (finalMatch) {
      const winnerId = finalMatch.score1! > finalMatch.score2!
        ? finalMatch.player1Id
        : finalMatch.player2Id;
      return tournament.players.find(p => p.id === winnerId) || null;
    }
  }

  return null;
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
