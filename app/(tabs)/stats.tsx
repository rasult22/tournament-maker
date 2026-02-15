import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../hooks/useColors';
import { getTournaments } from '../../storage/tournaments';
import { calculateGlobalStats, GlobalPlayerStats } from '../../utils/stats';

export default function StatsScreen() {
  const colors = useColors();
  const [stats, setStats] = useState<GlobalPlayerStats[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    const tournaments = await getTournaments();
    const globalStats = calculateGlobalStats(tournaments);
    setStats(globalStats);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [loadStats]);

  const renderPlayer = ({ item, index }: { item: GlobalPlayerStats; index: number }) => {
    const isTop3 = index < 3;

    return (
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.positionContainer}>
          {isTop3 ? (
            <Ionicons
              name="medal-outline"
              size={24}
              color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
            />
          ) : (
            <Text style={[styles.position, { color: colors.textSecondary }]}>{index + 1}</Text>
          )}
        </View>

        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, { color: colors.text }]}>{item.playerName}</Text>
          <Text style={[styles.playerMeta, { color: colors.textSecondary }]}>
            {item.tournaments} турниров · {item.titles} титулов
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{item.gamesPlayed}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Игр</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.success }]}>{item.wins}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>W</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.textSecondary }]}>{item.draws}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>D</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.error }]}>{item.losses}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>L</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.tint }]}>{item.winRate}%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>WR</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={stats}
        keyExtractor={(item) => item.playerId}
        renderItem={renderPlayer}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="stats-chart-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Нет статистики
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Сыграйте несколько матчей
            </Text>
          </View>
        }
        ListHeaderComponent={
          stats.length > 0 ? (
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Рейтинг игроков</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                По винрейту за все турниры
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  positionContainer: {
    width: 32,
    alignItems: 'center',
  },
  position: {
    fontSize: 16,
    fontWeight: '600',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  playerMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 28,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 10,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
});
