import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShareableCard, SHARE_THEMES } from '../ShareableCard';
import { GlobalPlayerStats } from '../../utils/stats';

interface PlayerStatsShareProps {
  stats: GlobalPlayerStats;
  rank: number;
  theme?: 'dark' | 'light' | 'gradient';
}

export function PlayerStatsShare({ stats, rank, theme = 'dark' }: PlayerStatsShareProps) {
  const colors = SHARE_THEMES[theme];

  const getRankEmoji = (r: number) => {
    if (r === 1) return '🥇';
    if (r === 2) return '🥈';
    if (r === 3) return '🥉';
    return `#${r}`;
  };

  return (
    <ShareableCard title={stats.playerName} subtitle="Статистика игрока" theme={theme}>
        {/* Rank & Titles */}
        <View style={styles.topRow}>
          <View style={[styles.rankBadge, { backgroundColor: colors.accent + '20' }]}>
            <Text style={styles.rankEmoji}>{getRankEmoji(rank)}</Text>
            <Text style={[styles.rankText, { color: colors.accent }]}>в рейтинге</Text>
          </View>
          {stats.titles > 0 && (
            <View style={[styles.titlesBadge, { backgroundColor: '#FFD70020' }]}>
              <Text style={styles.titlesEmoji}>🏆</Text>
              <Text style={styles.titlesCount}>{stats.titles}</Text>
            </View>
          )}
        </View>

        {/* Win Rate Circle */}
        <View style={styles.winRateContainer}>
          <View style={[styles.winRateCircle, { borderColor: colors.accent }]}>
            <Text style={[styles.winRateValue, { color: colors.accent }]}>{stats.winRate}%</Text>
            <Text style={[styles.winRateLabel, { color: colors.textSecondary }]}>винрейт</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.gamesPlayed}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Игр</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#22C55E' }]}>{stats.wins}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Побед</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.textSecondary }]}>{stats.draws}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Ничьих</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{stats.losses}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Поражений</Text>
          </View>
        </View>

        {/* Goals */}
        <View style={[styles.goalsRow, { backgroundColor: colors.card }]}>
          <View style={styles.goalStat}>
            <Text style={[styles.goalValue, { color: '#22C55E' }]}>{stats.goalsFor}</Text>
            <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>Забито</Text>
          </View>
          <View style={[styles.goalDivider, { backgroundColor: colors.textSecondary }]} />
          <View style={styles.goalStat}>
            <Text style={[styles.goalValue, { color: '#EF4444' }]}>{stats.goalsAgainst}</Text>
            <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>Пропущено</Text>
          </View>
          <View style={[styles.goalDivider, { backgroundColor: colors.textSecondary }]} />
          <View style={styles.goalStat}>
            <Text
              style={[
                styles.goalValue,
                { color: stats.goalDifference >= 0 ? '#22C55E' : '#EF4444' },
              ]}
            >
              {stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}
            </Text>
            <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>Разница</Text>
          </View>
        </View>

        {/* Tournaments */}
        <Text style={[styles.tournamentsText, { color: colors.textSecondary }]}>
          Участвовал в {stats.tournaments} турнирах
        </Text>
      </ShareableCard>
    );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  rankEmoji: {
    fontSize: 18,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
  },
  titlesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 4,
  },
  titlesEmoji: {
    fontSize: 16,
  },
  titlesCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
  },
  winRateContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  winRateCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winRateValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  winRateLabel: {
    fontSize: 11,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  goalsRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  goalStat: {
    flex: 1,
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  goalLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  goalDivider: {
    width: 1,
    height: '100%',
    opacity: 0.3,
  },
  tournamentsText: {
    textAlign: 'center',
    fontSize: 12,
  },
});
