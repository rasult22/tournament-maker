import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../hooks/useColors';
import { Tournament } from '../../types';
import { getTournaments, deleteTournament } from '../../storage/tournaments';

const TYPE_LABELS: Record<string, string> = {
  league: 'Лига',
  playoff: 'Плей-офф',
  league_playoff: 'Лига + Плей-офф',
};

export default function TournamentsScreen() {
  const colors = useColors();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTournaments = useCallback(async () => {
    const data = await getTournaments();
    setTournaments(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTournaments();
    }, [loadTournaments])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTournaments();
    setRefreshing(false);
  }, [loadTournaments]);

  const handleDelete = (tournament: Tournament) => {
    Alert.alert(
      'Удалить турнир?',
      `"${tournament.name}" будет удалён безвозвратно`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await deleteTournament(tournament.id);
            loadTournaments();
          },
        },
      ]
    );
  };

  const renderTournament = ({ item }: { item: Tournament }) => {
    const finishedMatches = item.matches.filter(m => m.status === 'finished').length;
    const totalMatches = item.matches.length;
    const progress = totalMatches > 0 ? (finishedMatches / totalMatches) * 100 : 0;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push(`/tournament/${item.id}`)}
        onLongPress={() => handleDelete(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'active' ? colors.success : colors.textSecondary },
            ]}
          >
            <Text style={styles.statusText}>
              {item.status === 'active' ? 'Активен' : 'Завершён'}
            </Text>
          </View>
        </View>

        <View style={styles.cardInfo}>
          <Text style={[styles.cardType, { color: colors.textSecondary }]}>
            {TYPE_LABELS[item.type]}
          </Text>
          <Text style={[styles.cardPlayers, { color: colors.textSecondary }]}>
            {item.players.length} игроков
          </Text>
        </View>

        <View style={[styles.progressBar, { backgroundColor: colors.backgroundSecondary }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: colors.tint },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {finishedMatches} / {totalMatches} матчей
        </Text>
      </TouchableOpacity>
    );
  };

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        renderItem={renderTournament}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="trophy-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Нет турниров
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Создайте первый турнир
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.tint }]}
        onPress={() => router.push('/tournament/create')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    list: {
      padding: 16,
      paddingBottom: 100,
    },
    card: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
    },
    cardInfo: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    cardType: {
      fontSize: 14,
    },
    cardPlayers: {
      fontSize: 14,
    },
    progressBar: {
      height: 4,
      borderRadius: 2,
      marginBottom: 6,
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    progressText: {
      fontSize: 12,
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
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
  });
