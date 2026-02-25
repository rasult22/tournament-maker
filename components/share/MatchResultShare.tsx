import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShareableCard, SHARE_THEMES } from '../ShareableCard';

interface MatchResultShareProps {
  tournamentName: string;
  player1Name: string;
  player2Name: string;
  score1: number;
  score2: number;
  theme?: 'dark' | 'light' | 'gradient';
}

export function MatchResultShare({ tournamentName, player1Name, player2Name, score1, score2, theme = 'dark' }: MatchResultShareProps) {
  const colors = SHARE_THEMES[theme];
  const isDraw = score1 === score2;
  const winner = score1 > score2 ? 1 : score2 > score1 ? 2 : 0;

  return (
    <ShareableCard title={tournamentName} subtitle="Результат матча" theme={theme}>
        <View style={styles.matchContainer}>
          {/* Player 1 */}
          <View style={[styles.playerSide, winner === 1 && styles.winnerSide]}>
            {winner === 1 && <Text style={styles.crown}>👑</Text>}
            <Text
              style={[
                styles.playerName,
                { color: winner === 1 ? colors.accent : colors.text },
                winner === 1 && styles.bold,
              ]}
              numberOfLines={1}
            >
              {player1Name}
            </Text>
          </View>

          {/* Score */}
          <View style={styles.scoreContainer}>
            <Text style={[styles.score, { color: winner === 1 ? colors.accent : colors.text }]}>
              {score1}
            </Text>
            <Text style={[styles.scoreDivider, { color: colors.textSecondary }]}>:</Text>
            <Text style={[styles.score, { color: winner === 2 ? colors.accent : colors.text }]}>
              {score2}
            </Text>
          </View>

          {/* Player 2 */}
          <View style={[styles.playerSide, styles.playerSideRight, winner === 2 && styles.winnerSide]}>
            {winner === 2 && <Text style={styles.crown}>👑</Text>}
            <Text
              style={[
                styles.playerName,
                styles.playerNameRight,
                { color: winner === 2 ? colors.accent : colors.text },
                winner === 2 && styles.bold,
              ]}
              numberOfLines={1}
            >
              {player2Name}
            </Text>
          </View>
        </View>

        {/* Result label */}
        <View style={[styles.resultBadge, { backgroundColor: colors.accent + '20' }]}>
          <Text style={[styles.resultText, { color: colors.accent }]}>
            {isDraw ? '🤝 Ничья' : `🏆 Победа ${winner === 1 ? player1Name : player2Name}`}
          </Text>
        </View>
      </ShareableCard>
    );
}

const styles = StyleSheet.create({
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  playerSide: {
    flex: 1,
    alignItems: 'flex-start',
  },
  playerSideRight: {
    alignItems: 'flex-end',
  },
  winnerSide: {},
  crown: {
    fontSize: 20,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 18,
    maxWidth: 100,
  },
  playerNameRight: {
    textAlign: 'right',
  },
  bold: {
    fontWeight: '700',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  score: {
    fontSize: 48,
    fontWeight: '800',
  },
  scoreDivider: {
    fontSize: 32,
    marginHorizontal: 8,
  },
  resultBadge: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
