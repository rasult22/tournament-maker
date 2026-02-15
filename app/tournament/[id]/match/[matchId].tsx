import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '../../../../hooks/useColors';
import { Tournament, Match } from '../../../../types';
import { getTournamentById, saveTournament } from '../../../../storage/tournaments';
import { updatePlayoffBracket } from '../../../../utils/tournament';

export default function MatchScreen() {
  const { id, matchId } = useLocalSearchParams<{ id: string; matchId: string }>();
  const colors = useColors();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    loadData();
  }, [id, matchId]);

  const loadData = async () => {
    if (!id) return;
    const data = await getTournamentById(id);
    if (data) {
      setTournament(data);
      const foundMatch = data.matches.find(m => m.id === matchId);
      if (foundMatch) {
        setMatch(foundMatch);
        setScore1(foundMatch.score1 ?? 0);
        setScore2(foundMatch.score2 ?? 0);
      }
    }
  };

  const incrementScore = (player: 1 | 2) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (player === 1) {
      setScore1(s => s + 1);
    } else {
      setScore2(s => s + 1);
    }
  };

  const decrementScore = (player: 1 | 2) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (player === 1) {
      setScore1(s => Math.max(0, s - 1));
    } else {
      setScore2(s => Math.max(0, s - 1));
    }
  };

  const handleSave = async () => {
    if (!tournament || !match) return;

    // Для плей-офф ничья недопустима
    if ((tournament.type === 'playoff' || (tournament.type === 'league_playoff' && tournament.phase === 'playoff')) && score1 === score2) {
      Alert.alert('Ошибка', 'В плей-офф не может быть ничьи. Должен быть победитель.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const updatedMatch: Match = {
      ...match,
      score1,
      score2,
      status: 'finished',
    };

    let updatedMatches = tournament.matches.map(m =>
      m.id === matchId ? updatedMatch : m
    );

    // Для плей-офф обновляем следующий раунд
    if (tournament.type === 'playoff' || (tournament.type === 'league_playoff' && tournament.phase === 'playoff')) {
      updatedMatches = updatePlayoffBracket(updatedMatches, matchId);
    }

    const updatedTournament: Tournament = {
      ...tournament,
      matches: updatedMatches,
    };

    await saveTournament(updatedTournament);
    router.back();
  };

  if (!tournament || !match) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Загрузка...</Text>
      </View>
    );
  }

  const player1 = tournament.players.find(p => p.id === match.player1Id);
  const player2 = tournament.players.find(p => p.id === match.player2Id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Player 1 */}
        <View style={styles.playerSection}>
          <Text style={[styles.playerName, { color: colors.text }]}>
            {player1?.name || 'Игрок 1'}
          </Text>
          <View style={styles.scoreControls}>
            <TouchableOpacity
              style={[styles.scoreButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              onPress={() => decrementScore(1)}
            >
              <Ionicons name="remove" size={32} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.score, { color: colors.text }]}>{score1}</Text>
            <TouchableOpacity
              style={[styles.scoreButton, { backgroundColor: colors.tint }]}
              onPress={() => incrementScore(1)}
            >
              <Ionicons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* VS Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.vsText, { color: colors.textSecondary }]}>VS</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Player 2 */}
        <View style={styles.playerSection}>
          <Text style={[styles.playerName, { color: colors.text }]}>
            {player2?.name || 'Игрок 2'}
          </Text>
          <View style={styles.scoreControls}>
            <TouchableOpacity
              style={[styles.scoreButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              onPress={() => decrementScore(2)}
            >
              <Ionicons name="remove" size={32} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.score, { color: colors.text }]}>{score2}</Text>
            <TouchableOpacity
              style={[styles.scoreButton, { backgroundColor: colors.tint }]}
              onPress={() => incrementScore(2)}
            >
              <Ionicons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Result Preview */}
      <View style={[styles.resultPreview, { backgroundColor: colors.backgroundSecondary }]}>
        {score1 === score2 ? (
          <Text style={[styles.resultText, { color: colors.textSecondary }]}>Ничья</Text>
        ) : score1 > score2 ? (
          <Text style={[styles.resultText, { color: colors.success }]}>
            Победа {player1?.name}
          </Text>
        ) : (
          <Text style={[styles.resultText, { color: colors.success }]}>
            Победа {player2?.name}
          </Text>
        )}
      </View>

      {/* Save Button */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.tint }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Сохранить результат</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  playerSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  playerName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  scoreControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  scoreButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  score: {
    fontSize: 72,
    fontWeight: '700',
    minWidth: 100,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  vsText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  resultPreview: {
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
