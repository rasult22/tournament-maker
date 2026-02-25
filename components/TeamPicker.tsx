import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../hooks/useColors';
import { Team, League, TEAMS, LEAGUES, getTeamsByLeague, searchTeams, getTeamsByRating } from '../data/teams';
import { TeamBadge } from './TeamBadge';

interface TeamPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (team: Team) => void;
  selectedTeamId?: string;
}

export function TeamPicker({ visible, onClose, onSelect, selectedTeamId }: TeamPickerProps) {
  const colors = useColors();
  const [search, setSearch] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<League | 'all'>('all');

  const filteredTeams = useMemo(() => {
    if (search.trim()) {
      return searchTeams(search);
    }
    if (selectedLeague === 'all') {
      return getTeamsByRating();
    }
    return getTeamsByLeague(selectedLeague);
  }, [search, selectedLeague]);

  const handleSelect = (team: Team) => {
    onSelect(team);
    onClose();
    setSearch('');
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={12} color="#FFD700" />
      );
    }
    if (hasHalf) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
      );
    }

    return <View style={styles.stars}>{stars}</View>;
  };

  const renderTeam = ({ item }: { item: Team }) => {
    const isSelected = item.id === selectedTeamId;
    const league = LEAGUES.find(l => l.id === item.league);

    return (
      <TouchableOpacity
        style={[
          styles.teamRow,
          { backgroundColor: colors.card, borderColor: colors.border },
          isSelected && { borderColor: colors.tint, backgroundColor: colors.tint + '15' },
        ]}
        onPress={() => handleSelect(item)}
      >
        <TeamBadge team={item} size="medium" />
        <View style={styles.teamInfo}>
          <Text style={[styles.teamName, { color: colors.text }]}>{item.name}</Text>
          <View style={styles.teamMeta}>
            <Text style={[styles.leagueName, { color: colors.textSecondary }]}>
              {league?.flag} {league?.name}
            </Text>
            {renderStars(item.rating)}
          </View>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelText, { color: colors.tint }]}>Отмена</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Выбор команды</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBox, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Поиск команды..."
              placeholderTextColor={colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* League Filter */}
        <View style={styles.leagueFilter}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: 'all', name: 'Все', flag: '🌍' }, ...LEAGUES]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.leagueList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.leagueChip,
                  { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                  selectedLeague === item.id && { backgroundColor: colors.tint, borderColor: colors.tint },
                ]}
                onPress={() => setSelectedLeague(item.id as League | 'all')}
              >
                <Text style={styles.leagueFlag}>{item.flag}</Text>
                <Text
                  style={[
                    styles.leagueChipText,
                    { color: selectedLeague === item.id ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {item.id === 'all' ? 'Все' : item.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Teams List */}
        <FlatList
          data={filteredTeams}
          keyExtractor={(item) => `${item.id}-${item.name}`}
          renderItem={renderTeam}
          contentContainerStyle={styles.teamsList}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Команды не найдены
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  leagueFilter: {
    paddingBottom: 8,
  },
  leagueList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  leagueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  leagueFlag: {
    fontSize: 16,
  },
  leagueChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  teamsList: {
    padding: 16,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
  },
  teamMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  leagueName: {
    fontSize: 13,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});
