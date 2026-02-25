import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../../hooks/useColors';
import { Tournament } from '../../../types';
import { getTournamentById, saveTournament } from '../../../storage/tournaments';
import {
  calculateStandings,
  transitionToPlayoff,
  checkTournamentCompletion,
  getTournamentWinner,
} from '../../../utils/tournament';
import { ShareModal } from '../../../components/share/ShareModal';
import { StandingsShare } from '../../../components/share/StandingsShare';
import { TournamentBracket } from '../../../components/TournamentBracket';
import { TeamBadge } from '../../../components/TeamBadge';
import { getTeamById } from '../../../data/teams';

export default function TournamentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'matches' | 'bracket'>('table');
  const [showShareModal, setShowShareModal] = useState(false);

  const loadTournament = useCallback(async () => {
    if (!id) return;
    const data = await getTournamentById(id);
    setTournament(data);

    // Определяем начальный таб
    if (data) {
      if (data.type === 'playoff') {
        setActiveTab('bracket');
      } else {
        setActiveTab('table');
      }
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadTournament();
    }, [loadTournament])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTournament();
    setRefreshing(false);
  }, [loadTournament]);

  const handleStartPlayoff = async () => {
    if (!tournament || tournament.type !== 'league_playoff') return;

    const leagueFinished = tournament.matches.every(m => m.status === 'finished');
    if (!leagueFinished) {
      Alert.alert('Ошибка', 'Сначала завершите все матчи группового этапа');
      return;
    }

    const updated = transitionToPlayoff(tournament);
    await saveTournament(updated);
    setTournament(updated);
    setActiveTab('bracket');
  };

  const handleFinishTournament = async () => {
    if (!tournament) return;

    Alert.alert('Завершить турнир?', 'Это действие нельзя отменить', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Завершить',
        onPress: async () => {
          const updated = { ...tournament, status: 'finished' as const };
          await saveTournament(updated);
          setTournament(updated);
          setShowShareModal(true);
        },
      },
    ]);
  };

  if (!tournament) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Загрузка...</Text>
      </View>
    );
  }

  const standings = calculateStandings(tournament);
  const winner = getTournamentWinner(tournament);
  const isComplete = checkTournamentCompletion(tournament);

  const showTable = tournament.type === 'league' || tournament.type === 'league_playoff';
  const showBracket = tournament.type === 'playoff' || (tournament.type === 'league_playoff' && tournament.phase === 'playoff');

  const getPlayerName = (playerId: string) => {
    if (playerId === 'bye') return 'BYE';
    if (playerId === 'tbd') return 'TBD';
    return tournament.players.find(p => p.id === playerId)?.name || 'Unknown';
  };

  const getPlayerTeam = (playerId: string) => {
    const player = tournament.players.find(p => p.id === playerId);
    if (player?.teamId) {
      return getTeamById(player.teamId);
    }
    return undefined;
  };

  const pendingMatches = tournament.matches.filter(
    m => m.status === 'pending' && m.player1Id !== 'tbd' && m.player2Id !== 'tbd' && m.player1Id !== 'bye' && m.player2Id !== 'bye'
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: tournament.name,
          headerRight: () => showTable ? (
            <TouchableOpacity onPress={() => setShowShareModal(true)} style={{ marginRight: 8 }}>
              <Ionicons name="share-outline" size={24} color={colors.tint} />
            </TouchableOpacity>
          ) : null,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Winner Banner */}
        {tournament.status === 'finished' && winner && (
          <View style={[styles.winnerBanner, { backgroundColor: colors.tint + '20' }]}>
            <Ionicons name="trophy" size={24} color={colors.tint} />
            <Text style={[styles.winnerText, { color: colors.tint }]}>
              Победитель: {winner.name}
            </Text>
          </View>
        )}

        {/* Tabs */}
        <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
          {showTable && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'table' && { borderBottomColor: colors.tint }]}
              onPress={() => setActiveTab('table')}
            >
              <Text style={[styles.tabText, { color: activeTab === 'table' ? colors.tint : colors.textSecondary }]}>
                Таблица
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.tab, activeTab === 'matches' && { borderBottomColor: colors.tint }]}
            onPress={() => setActiveTab('matches')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'matches' ? colors.tint : colors.textSecondary }]}>
              Матчи
            </Text>
          </TouchableOpacity>
          {showBracket && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'bracket' && { borderBottomColor: colors.tint }]}
              onPress={() => setActiveTab('bracket')}
            >
              <Text style={[styles.tabText, { color: activeTab === 'bracket' ? colors.tint : colors.textSecondary }]}>
                Сетка
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Table View */}
          {activeTab === 'table' && showTable && (
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.tableHeaderCell, styles.posCell, { color: colors.textSecondary }]}>#</Text>
                <Text style={[styles.tableHeaderCell, styles.nameCell, { color: colors.textSecondary }]}>Игрок</Text>
                <Text style={[styles.tableHeaderCell, styles.statCell, { color: colors.textSecondary }]}>И</Text>
                <Text style={[styles.tableHeaderCell, styles.statCell, { color: colors.textSecondary }]}>В</Text>
                <Text style={[styles.tableHeaderCell, styles.statCell, { color: colors.textSecondary }]}>Н</Text>
                <Text style={[styles.tableHeaderCell, styles.statCell, { color: colors.textSecondary }]}>П</Text>
                <Text style={[styles.tableHeaderCell, styles.statCell, { color: colors.textSecondary }]}>РМ</Text>
                <Text style={[styles.tableHeaderCell, styles.statCell, { color: colors.textSecondary }]}>О</Text>
              </View>

              {standings.map((row, index) => {
                const isQualified = tournament.type === 'league_playoff' &&
                  tournament.phase === 'league' &&
                  index < (tournament.playoffQualifiers || 4);

                return (
                  <View
                    key={row.playerId}
                    style={[
                      styles.tableRow,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      isQualified && { backgroundColor: colors.tint + '10' },
                    ]}
                  >
                    <Text style={[styles.tableCell, styles.posCell, { color: colors.text }]}>{row.position}</Text>
                    <Text style={[styles.tableCell, styles.nameCell, { color: colors.text }]} numberOfLines={1}>
                      {row.playerName}
                    </Text>
                    <Text style={[styles.tableCell, styles.statCell, { color: colors.textSecondary }]}>{row.gamesPlayed}</Text>
                    <Text style={[styles.tableCell, styles.statCell, { color: colors.success }]}>{row.wins}</Text>
                    <Text style={[styles.tableCell, styles.statCell, { color: colors.textSecondary }]}>{row.draws}</Text>
                    <Text style={[styles.tableCell, styles.statCell, { color: colors.error }]}>{row.losses}</Text>
                    <Text style={[styles.tableCell, styles.statCell, { color: row.goalDifference >= 0 ? colors.text : colors.error }]}>
                      {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                    </Text>
                    <Text style={[styles.tableCell, styles.statCell, styles.pointsCell, { color: colors.text }]}>{row.points}</Text>
                  </View>
                );
              })}

              {tournament.type === 'league_playoff' && tournament.phase === 'league' && (
                <View style={styles.qualifierNote}>
                  <View style={[styles.qualifierDot, { backgroundColor: colors.tint }]} />
                  <Text style={[styles.qualifierText, { color: colors.textSecondary }]}>
                    Выходят в плей-офф: топ {tournament.playoffQualifiers || 4}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Matches View */}
          {activeTab === 'matches' && (
            <View style={styles.matchesContainer}>
              {pendingMatches.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Предстоящие матчи</Text>
                  {pendingMatches.map(match => (
                    <TouchableOpacity
                      key={match.id}
                      style={[styles.matchCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                      onPress={() => router.push(`/tournament/${id}/match/${match.id}`)}
                    >
                      <View style={styles.matchPlayers}>
                        {(() => {
                          const team1 = getPlayerTeam(match.player1Id);
                          return (
                            <View style={styles.matchPlayerInfo}>
                              {team1 && <TeamBadge team={team1} size="small" />}
                              <View>
                                <Text style={[styles.matchPlayer, { color: colors.text }]}>{getPlayerName(match.player1Id)}</Text>
                                {team1 && <Text style={[styles.matchTeamName, { color: colors.textSecondary }]}>{team1.shortName}</Text>}
                              </View>
                            </View>
                          );
                        })()}
                        <Text style={[styles.matchVs, { color: colors.textSecondary }]}>vs</Text>
                        {(() => {
                          const team2 = getPlayerTeam(match.player2Id);
                          return (
                            <View style={[styles.matchPlayerInfo, styles.matchPlayerInfoRight]}>
                              <View style={styles.matchPlayerTextRight}>
                                <Text style={[styles.matchPlayer, { color: colors.text }]}>{getPlayerName(match.player2Id)}</Text>
                                {team2 && <Text style={[styles.matchTeamName, { color: colors.textSecondary }]}>{team2.shortName}</Text>}
                              </View>
                              {team2 && <TeamBadge team={team2} size="small" />}
                            </View>
                          );
                        })()}
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {tournament.matches.filter(m => m.status === 'finished').length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Завершённые</Text>
                  {tournament.matches
                    .filter(m => m.status === 'finished' && m.player1Id !== 'bye')
                    .map(match => (
                      <View
                        key={match.id}
                        style={[styles.matchCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                      >
                        <View style={styles.matchPlayers}>
                          {(() => {
                            const team1 = getPlayerTeam(match.player1Id);
                            return (
                              <View style={styles.matchPlayerInfo}>
                                {team1 && <TeamBadge team={team1} size="small" />}
                                <View>
                                  <Text style={[
                                    styles.matchPlayer,
                                    { color: match.score1! > match.score2! ? colors.text : colors.textSecondary },
                                    match.score1! > match.score2! && styles.matchWinner,
                                  ]}>
                                    {getPlayerName(match.player1Id)}
                                  </Text>
                                  {team1 && <Text style={[styles.matchTeamName, { color: colors.textSecondary }]}>{team1.shortName}</Text>}
                                </View>
                              </View>
                            );
                          })()}
                          <Text style={[styles.matchScore, { color: colors.text }]}>
                            {match.score1} - {match.score2}
                          </Text>
                          {(() => {
                            const team2 = getPlayerTeam(match.player2Id);
                            return (
                              <View style={[styles.matchPlayerInfo, styles.matchPlayerInfoRight]}>
                                <View style={styles.matchPlayerTextRight}>
                                  <Text style={[
                                    styles.matchPlayer,
                                    { color: match.score2! > match.score1! ? colors.text : colors.textSecondary },
                                    match.score2! > match.score1! && styles.matchWinner,
                                  ]}>
                                    {getPlayerName(match.player2Id)}
                                  </Text>
                                  {team2 && <Text style={[styles.matchTeamName, { color: colors.textSecondary }]}>{team2.shortName}</Text>}
                                </View>
                                {team2 && <TeamBadge team={team2} size="small" />}
                              </View>
                            );
                          })()}
                        </View>
                      </View>
                    ))}
                </>
              )}
            </View>
          )}

          {/* Bracket View */}
          {activeTab === 'bracket' && showBracket && (
            <TournamentBracket
              matches={tournament.matches.filter(m =>
                tournament.type === 'playoff' ||
                (tournament.type === 'league_playoff' && tournament.phase === 'playoff' && m.round > 0)
              )}
              players={tournament.players}
              getPlayerName={getPlayerName}
              onMatchPress={(matchId) => router.push(`/tournament/${id}/match/${matchId}`)}
              colors={colors}
            />
          )}
        </ScrollView>

        {/* Action Button */}
        {tournament.status === 'active' && (
          <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
            {tournament.type === 'league_playoff' && tournament.phase === 'league' && isComplete && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.tint }]}
                onPress={handleStartPlayoff}
              >
                <Text style={styles.actionButtonText}>Начать плей-офф</Text>
              </TouchableOpacity>
            )}
            {isComplete && !(tournament.type === 'league_playoff' && tournament.phase === 'league') && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.success }]}
                onPress={handleFinishTournament}
              >
                <Text style={styles.actionButtonText}>Завершить турнир</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Share Modal */}
        <ShareModal
          visible={showShareModal}
          onClose={() => setShowShareModal(false)}
          renderContent={(theme) => (
            <StandingsShare
              tournamentName={tournament.name}
              standings={standings}
              theme={theme}
            />
          )}
        />
      </View>
    </>
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
  winnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  winnerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  tableContainer: {
    gap: 2,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tableHeader: {
    borderRadius: 8,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '600',
  },
  tableCell: {
    fontSize: 14,
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
    width: 28,
    textAlign: 'center',
  },
  pointsCell: {
    fontWeight: '700',
  },
  qualifierNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  qualifierDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  qualifierText: {
    fontSize: 12,
  },
  matchesContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  matchPlayers: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  matchPlayerInfoRight: {
    justifyContent: 'flex-end',
  },
  matchPlayerTextRight: {
    alignItems: 'flex-end',
  },
  matchPlayer: {
    fontSize: 15,
  },
  matchTeamName: {
    fontSize: 11,
    marginTop: 2,
  },
  matchWinner: {
    fontWeight: '600',
  },
  matchVs: {
    fontSize: 12,
    marginHorizontal: 8,
  },
  matchScore: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 12,
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
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
