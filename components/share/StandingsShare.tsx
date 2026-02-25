import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShareableCard, SHARE_THEMES } from '../ShareableCard';
import { StandingsRow } from '../../types';

interface StandingsShareProps {
  tournamentName: string;
  standings: StandingsRow[];
  theme?: 'dark' | 'light' | 'gradient';
}

export function StandingsShare({ tournamentName, standings, theme = 'dark' }: StandingsShareProps) {
  const colors = SHARE_THEMES[theme];
  const topPlayers = standings.slice(0, 8);

  return (
    <ShareableCard title={tournamentName} subtitle="Турнирная таблица" theme={theme}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.posCell, { color: colors.textSecondary }]}>#</Text>
          <Text style={[styles.cell, styles.nameCell, { color: colors.textSecondary }]}>Игрок</Text>
          <Text style={[styles.cell, styles.statCell, { color: colors.textSecondary }]}>И</Text>
          <Text style={[styles.cell, styles.statCell, { color: colors.textSecondary }]}>В</Text>
          <Text style={[styles.cell, styles.statCell, { color: colors.textSecondary }]}>РМ</Text>
          <Text style={[styles.cell, styles.statCell, { color: colors.textSecondary }]}>О</Text>
        </View>

        {/* Players */}
        {topPlayers.map((row, index) => (
          <View
            key={row.playerId}
            style={[
              styles.row,
              { backgroundColor: index === 0 ? colors.accent + '20' : 'transparent' },
            ]}
          >
            <Text
              style={[
                styles.cell,
                styles.posCell,
                { color: index === 0 ? colors.accent : colors.text },
              ]}
            >
              {row.position}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.nameCell,
                { color: colors.text },
                index === 0 && styles.bold,
              ]}
              numberOfLines={1}
            >
              {index === 0 ? '👑 ' : ''}{row.playerName}
            </Text>
            <Text style={[styles.cell, styles.statCell, { color: colors.textSecondary }]}>
              {row.gamesPlayed}
            </Text>
            <Text style={[styles.cell, styles.statCell, { color: '#22C55E' }]}>{row.wins}</Text>
            <Text
              style={[
                styles.cell,
                styles.statCell,
                { color: row.goalDifference >= 0 ? colors.text : '#EF4444' },
              ]}
            >
              {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
            </Text>
            <Text style={[styles.cell, styles.statCell, styles.bold, { color: colors.text }]}>
              {row.points}
            </Text>
          </View>
        ))}
      </ShareableCard>
    );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  headerRow: {
    marginBottom: 4,
  },
  cell: {
    fontSize: 13,
  },
  posCell: {
    width: 24,
    textAlign: 'center',
  },
  nameCell: {
    flex: 1,
    paddingLeft: 8,
  },
  statCell: {
    width: 32,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
});
