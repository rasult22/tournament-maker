import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../hooks/useColors';
import { TournamentType, Player, Tournament } from '../../types';
import { saveTournament } from '../../storage/tournaments';
import { generateId } from '../../utils/generateId';
import { generateLeagueMatches, generatePlayoffMatches } from '../../utils/tournament';

const TOURNAMENT_TYPES: { value: TournamentType; label: string; description: string }[] = [
  { value: 'league', label: 'Лига', description: 'Все играют со всеми' },
  { value: 'playoff', label: 'Плей-офф', description: 'На вылет' },
  { value: 'league_playoff', label: 'Лига + Плей-офф', description: 'Групповой этап → сетка' },
];

export default function CreateTournamentScreen() {
  const colors = useColors();
  const [name, setName] = useState('');
  const [type, setType] = useState<TournamentType>('league');
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [playoffQualifiers, setPlayoffQualifiers] = useState(4);

  const addPlayer = () => {
    const trimmedName = newPlayerName.trim();
    if (!trimmedName) return;

    if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      Alert.alert('Ошибка', 'Игрок с таким именем уже добавлен');
      return;
    }

    setPlayers([...players, { id: generateId(), name: trimmedName }]);
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const validateAndCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите название турнира');
      return;
    }

    const minPlayers = type === 'playoff' ? 2 : type === 'league_playoff' ? 4 : 2;
    if (players.length < minPlayers) {
      Alert.alert('Ошибка', `Минимум ${minPlayers} игроков для этого формата`);
      return;
    }

    if (type === 'league_playoff' && playoffQualifiers > players.length) {
      Alert.alert('Ошибка', 'Количество выходящих в плей-офф не может быть больше количества игроков');
      return;
    }

    let matches;
    if (type === 'league') {
      matches = generateLeagueMatches(players);
    } else if (type === 'playoff') {
      matches = generatePlayoffMatches(players);
    } else {
      // league_playoff - сначала групповой этап
      matches = generateLeagueMatches(players);
    }

    const tournament: Tournament = {
      id: generateId(),
      name: name.trim(),
      type,
      players,
      matches,
      status: 'active',
      createdAt: Date.now(),
      ...(type === 'league_playoff' && {
        playoffQualifiers,
        phase: 'league',
      }),
    };

    await saveTournament(tournament);
    router.back();
  };

  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: colors.text }]}>Название турнира</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
          value={name}
          onChangeText={setName}
          placeholder="Например: FIFA Weekend Cup"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Формат</Text>
        <View style={styles.typeContainer}>
          {TOURNAMENT_TYPES.map(t => (
            <TouchableOpacity
              key={t.value}
              style={[
                styles.typeOption,
                { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                type === t.value && { borderColor: colors.tint, backgroundColor: colors.tint + '20' },
              ]}
              onPress={() => setType(t.value)}
            >
              <Text style={[styles.typeLabel, { color: type === t.value ? colors.tint : colors.text }]}>
                {t.label}
              </Text>
              <Text style={[styles.typeDesc, { color: colors.textSecondary }]}>{t.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {type === 'league_playoff' && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Выходят в плей-офф</Text>
            <View style={styles.qualifiersContainer}>
              {[2, 4, 8].map(n => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.qualifierOption,
                    { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                    playoffQualifiers === n && { borderColor: colors.tint, backgroundColor: colors.tint + '20' },
                  ]}
                  onPress={() => setPlayoffQualifiers(n)}
                >
                  <Text style={[styles.qualifierText, { color: playoffQualifiers === n ? colors.tint : colors.text }]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={[styles.label, { color: colors.text }]}>
          Участники ({players.length})
        </Text>

        <View style={styles.addPlayerRow}>
          <TextInput
            style={[styles.playerInput, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }]}
            value={newPlayerName}
            onChangeText={setNewPlayerName}
            placeholder="Имя игрока"
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={addPlayer}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.tint }]}
            onPress={addPlayer}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.playersList}>
          {players.map((player, index) => (
            <View
              key={player.id}
              style={[styles.playerRow, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            >
              <Text style={[styles.playerIndex, { color: colors.textSecondary }]}>{index + 1}</Text>
              <Text style={[styles.playerName, { color: colors.text }]}>{player.name}</Text>
              <TouchableOpacity onPress={() => removePlayer(player.id)}>
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.tint }]}
          onPress={validateAndCreate}
        >
          <Text style={styles.createButtonText}>Создать турнир</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 100,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      marginTop: 16,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
    },
    typeContainer: {
      gap: 8,
    },
    typeOption: {
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
    },
    typeLabel: {
      fontSize: 16,
      fontWeight: '600',
    },
    typeDesc: {
      fontSize: 13,
      marginTop: 2,
    },
    qualifiersContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    qualifierOption: {
      width: 60,
      height: 60,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qualifierText: {
      fontSize: 20,
      fontWeight: '600',
    },
    addPlayerRow: {
      flexDirection: 'row',
      gap: 8,
    },
    playerInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
    },
    addButton: {
      width: 50,
      height: 50,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playersList: {
      marginTop: 12,
      gap: 8,
    },
    playerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
    },
    playerIndex: {
      width: 24,
      fontSize: 14,
      fontWeight: '500',
    },
    playerName: {
      flex: 1,
      fontSize: 16,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      paddingBottom: 32,
      borderTopWidth: 1,
    },
    createButton: {
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
