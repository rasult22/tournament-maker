import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Match, Player } from '../types';
import { getTeamById, Team } from '../data/teams';
import { TeamBadge } from './TeamBadge';

interface TournamentBracketProps {
  matches: Match[];
  players: Player[];
  getPlayerName: (playerId: string) => string;
  onMatchPress: (matchId: string) => void;
  colors: {
    background: string;
    card: string;
    border: string;
    text: string;
    textSecondary: string;
    tint: string;
  };
}

const MATCH_WIDTH = 150;
const MATCH_HEIGHT = 90;
const HORIZONTAL_GAP = 50;
const VERTICAL_GAP = 20;

export function TournamentBracket({
  matches,
  players,
  getPlayerName,
  onMatchPress,
  colors,
}: TournamentBracketProps) {
  const getPlayerTeam = (playerId: string): Team | undefined => {
    const player = players.find(p => p.id === playerId);
    if (player?.teamId) {
      return getTeamById(player.teamId);
    }
    return undefined;
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

  const getRoundName = (round: number) => {
    const matchesInRound = matchesByRound[round]?.length || 0;
    if (matchesInRound === 1) return 'Финал';
    if (matchesInRound === 2) return 'Полуфинал';
    if (matchesInRound === 4) return 'Четвертьфинал';
    return `1/${matchesInRound * 2}`;
  };

  // Calculate positions for each match
  const getMatchPosition = (round: number, matchIndex: number) => {
    const roundIndex = rounds.indexOf(round);
    const matchesInRound = matchesByRound[round].length;
    const firstRoundMatches = matchesByRound[rounds[0]]?.length || 1;

    // Calculate total height based on first round
    const totalHeight = firstRoundMatches * (MATCH_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP;

    // Calculate vertical spacing for this round
    const spacing = totalHeight / matchesInRound;

    const x = roundIndex * (MATCH_WIDTH + HORIZONTAL_GAP);
    const y = (spacing * matchIndex) + (spacing - MATCH_HEIGHT) / 2;

    return { x, y };
  };

  // Generate connector paths between rounds
  const generateConnectors = () => {
    const paths: { d: string; key: string }[] = [];

    for (let i = 0; i < rounds.length - 1; i++) {
      const currentRound = rounds[i];
      const nextRound = rounds[i + 1];
      const currentMatches = matchesByRound[currentRound];
      const nextMatches = matchesByRound[nextRound];

      currentMatches.forEach((match, matchIndex) => {
        const nextMatchIndex = Math.floor(matchIndex / 2);
        const nextMatch = nextMatches[nextMatchIndex];

        if (!nextMatch) return;

        const currentPos = getMatchPosition(currentRound, matchIndex);
        const nextPos = getMatchPosition(nextRound, nextMatchIndex);

        const startX = currentPos.x + MATCH_WIDTH;
        const startY = currentPos.y + MATCH_HEIGHT / 2;
        const endX = nextPos.x;
        const endY = nextPos.y + MATCH_HEIGHT / 2;
        const midX = startX + HORIZONTAL_GAP / 2;

        // Create path: horizontal -> vertical -> horizontal
        const d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
        paths.push({ d, key: `${match.id}-${nextMatch.id}` });
      });
    }

    return paths;
  };

  // Calculate total dimensions
  const totalWidth = totalRounds * (MATCH_WIDTH + HORIZONTAL_GAP) - HORIZONTAL_GAP + 40;
  const firstRoundMatches = matchesByRound[rounds[0]]?.length || 1;
  const totalHeight = firstRoundMatches * (MATCH_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP + 60;

  const connectors = generateConnectors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.container, { width: totalWidth, height: totalHeight }]}>
        {/* Round titles */}
        {rounds.map((round) => {
          const pos = getMatchPosition(round, 0);
          return (
            <View
              key={`title-${round}`}
              style={[
                styles.roundTitle,
                { left: pos.x, width: MATCH_WIDTH },
              ]}
            >
              <Text style={[styles.roundTitleText, { color: colors.textSecondary }]}>
                {getRoundName(round)}
              </Text>
            </View>
          );
        })}

        {/* SVG Connectors */}
        <Svg
          width={totalWidth}
          height={totalHeight}
          style={StyleSheet.absoluteFill}
        >
          {connectors.map(({ d, key }) => (
            <Path
              key={key}
              d={d}
              stroke={colors.border}
              strokeWidth={2}
              fill="none"
            />
          ))}
        </Svg>

        {/* Match nodes */}
        {rounds.map((round) =>
          matchesByRound[round].map((match, matchIndex) => {
            const pos = getMatchPosition(round, matchIndex);
            const canPlay =
              match.status === 'pending' &&
              match.player1Id !== 'tbd' &&
              match.player2Id !== 'tbd' &&
              match.player1Id !== 'bye';

            const isFinished = match.status === 'finished';
            const player1Won = isFinished && (match.score1 ?? 0) > (match.score2 ?? 0);
            const player2Won = isFinished && (match.score2 ?? 0) > (match.score1 ?? 0);

            return (
              <TouchableOpacity
                key={match.id}
                style={[
                  styles.matchNode,
                  {
                    left: pos.x,
                    top: pos.y + 30, // Offset for round titles
                    width: MATCH_WIDTH,
                    height: MATCH_HEIGHT,
                    backgroundColor: colors.card,
                    borderColor: isFinished ? colors.tint : colors.border,
                  },
                ]}
                onPress={() => canPlay && onMatchPress(match.id)}
                disabled={!canPlay}
                activeOpacity={canPlay ? 0.7 : 1}
              >
                {/* Player 1 */}
                {(() => {
                  const team1 = getPlayerTeam(match.player1Id);
                  return (
                    <View
                      style={[
                        styles.playerRow,
                        player1Won && { backgroundColor: colors.tint + '20' },
                      ]}
                    >
                      {team1 && (
                        <View style={styles.teamBadgeWrapper}>
                          <TeamBadge team={team1} size="small" />
                        </View>
                      )}
                      <View style={styles.playerInfo}>
                        <Text
                          style={[
                            styles.playerName,
                            { color: player1Won ? colors.text : colors.textSecondary },
                            player1Won && styles.winnerName,
                          ]}
                          numberOfLines={1}
                        >
                          {getPlayerName(match.player1Id)}
                        </Text>
                        {team1 && (
                          <Text
                            style={[styles.teamName, { color: colors.textSecondary }]}
                            numberOfLines={1}
                          >
                            {team1.shortName}
                          </Text>
                        )}
                      </View>
                      {isFinished && (
                        <Text
                          style={[
                            styles.score,
                            { color: player1Won ? colors.text : colors.textSecondary },
                            player1Won && styles.winnerScore,
                          ]}
                        >
                          {match.score1}
                        </Text>
                      )}
                    </View>
                  );
                })()}

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Player 2 */}
                {(() => {
                  const team2 = getPlayerTeam(match.player2Id);
                  return (
                    <View
                      style={[
                        styles.playerRow,
                        player2Won && { backgroundColor: colors.tint + '20' },
                      ]}
                    >
                      {team2 && (
                        <View style={styles.teamBadgeWrapper}>
                          <TeamBadge team={team2} size="small" />
                        </View>
                      )}
                      <View style={styles.playerInfo}>
                        <Text
                          style={[
                            styles.playerName,
                            { color: player2Won ? colors.text : colors.textSecondary },
                            player2Won && styles.winnerName,
                          ]}
                          numberOfLines={1}
                        >
                          {getPlayerName(match.player2Id)}
                        </Text>
                        {team2 && (
                          <Text
                            style={[styles.teamName, { color: colors.textSecondary }]}
                            numberOfLines={1}
                          >
                            {team2.shortName}
                          </Text>
                        )}
                      </View>
                      {isFinished && (
                        <Text
                          style={[
                            styles.score,
                            { color: player2Won ? colors.text : colors.textSecondary },
                            player2Won && styles.winnerScore,
                          ]}
                        >
                          {match.score2}
                        </Text>
                      )}
                    </View>
                  );
                })()}
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    position: 'relative',
  },
  roundTitle: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  roundTitleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  matchNode: {
    position: 'absolute',
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  playerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  teamBadgeWrapper: {
    marginRight: 6,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 12,
  },
  teamName: {
    fontSize: 9,
    marginTop: 1,
  },
  winnerName: {
    fontWeight: '600',
  },
  score: {
    fontSize: 13,
    marginLeft: 6,
  },
  winnerScore: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
});
