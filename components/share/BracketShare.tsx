import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShareableCard, SHARE_THEMES } from '../ShareableCard';
import { Match, Player } from '../../types';

interface BracketShareProps {
  tournamentName: string;
  matches: Match[];
  players: Player[];
  winner?: Player;
  theme?: 'dark' | 'light' | 'gradient';
}

export function BracketShare({
  tournamentName,
  matches,
  players,
  winner,
  theme = 'dark',
}: BracketShareProps) {
  const colors = SHARE_THEMES[theme];

  const getPlayerName = (playerId: string) => {
    if (playerId === 'bye') return 'BYE';
    if (playerId === 'tbd') return 'TBD';
    return players.find(p => p.id === playerId)?.name || '—';
  };

  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.round;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);
  const totalRounds = rounds.length;

  // Calculate card width based on number of rounds
  // Base: 360px for up to 3 rounds, add ~80px per additional round
  const COLUMN_WIDTH = 100;
  const GAP = 8;
  const PADDING = 48; // 24px on each side
  const cardWidth = Math.max(360, totalRounds * COLUMN_WIDTH + (totalRounds - 1) * GAP + PADDING);

  const getRoundName = (round: number) => {
    const matchesInRound = matchesByRound[round]?.length || 0;
    if (matchesInRound === 1) return 'Финал';
    if (matchesInRound === 2) return 'Полуфинал';
    if (matchesInRound === 4) return '1/4';
    return `1/${matchesInRound * 2}`;
  };

  return (
    <ShareableCard title={tournamentName} subtitle="Плей-офф" theme={theme} width={cardWidth}>
      {/* Winner Banner */}
      {winner && (
        <View style={[styles.winnerBanner, { backgroundColor: colors.accent + '20' }]}>
          <Text style={styles.winnerEmoji}>👑</Text>
          <Text style={[styles.winnerName, { color: colors.accent }]}>
            {winner.name}
          </Text>
          <Text style={[styles.winnerLabel, { color: colors.textSecondary }]}>
            Победитель
          </Text>
        </View>
      )}

      {/* Bracket rounds */}
      <View style={styles.bracketContainer}>
        {rounds.map((round) => (
          <View key={round} style={styles.roundColumn}>
            <Text style={[styles.roundTitle, { color: colors.textSecondary }]}>
              {getRoundName(round)}
            </Text>
            {matchesByRound[round]
              .filter(m => m.player1Id !== 'bye')
              .map((match) => {
                const isFinished = match.status === 'finished';
                const player1Won = isFinished && (match.score1 ?? 0) > (match.score2 ?? 0);
                const player2Won = isFinished && (match.score2 ?? 0) > (match.score1 ?? 0);

                return (
                  <View
                    key={match.id}
                    style={[
                      styles.matchCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: isFinished ? colors.accent + '40' : colors.card,
                      },
                    ]}
                  >
                    {/* Player 1 */}
                    <View style={[
                      styles.playerRow,
                      player1Won && { backgroundColor: colors.accent + '15' },
                    ]}>
                      <Text
                        style={[
                          styles.playerName,
                          { color: player1Won ? colors.text : colors.textSecondary },
                          player1Won && styles.winnerText,
                        ]}
                        numberOfLines={1}
                      >
                        {getPlayerName(match.player1Id)}
                      </Text>
                      {isFinished && (
                        <Text
                          style={[
                            styles.score,
                            { color: player1Won ? colors.text : colors.textSecondary },
                            player1Won && styles.winnerText,
                          ]}
                        >
                          {match.score1}
                        </Text>
                      )}
                    </View>

                    {/* Divider */}
                    <View style={[styles.divider, { backgroundColor: colors.textSecondary + '30' }]} />

                    {/* Player 2 */}
                    <View style={[
                      styles.playerRow,
                      player2Won && { backgroundColor: colors.accent + '15' },
                    ]}>
                      <Text
                        style={[
                          styles.playerName,
                          { color: player2Won ? colors.text : colors.textSecondary },
                          player2Won && styles.winnerText,
                        ]}
                        numberOfLines={1}
                      >
                        {getPlayerName(match.player2Id)}
                      </Text>
                      {isFinished && (
                        <Text
                          style={[
                            styles.score,
                            { color: player2Won ? colors.text : colors.textSecondary },
                            player2Won && styles.winnerText,
                          ]}
                        >
                          {match.score2}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
          </View>
        ))}
      </View>
    </ShareableCard>
  );
}

const styles = StyleSheet.create({
  winnerBanner: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  winnerEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  winnerLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  bracketContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  roundColumn: {
    flex: 1,
    gap: 8,
  },
  roundTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  matchCard: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  playerName: {
    fontSize: 11,
    flex: 1,
  },
  score: {
    fontSize: 12,
    marginLeft: 4,
  },
  winnerText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
});
