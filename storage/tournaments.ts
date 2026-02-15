import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tournament } from '../types';

const TOURNAMENTS_KEY = 'tournaments';

export async function getTournaments(): Promise<Tournament[]> {
  const data = await AsyncStorage.getItem(TOURNAMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getTournamentById(id: string): Promise<Tournament | null> {
  const tournaments = await getTournaments();
  return tournaments.find(t => t.id === id) || null;
}

export async function saveTournament(tournament: Tournament): Promise<void> {
  const tournaments = await getTournaments();
  const index = tournaments.findIndex(t => t.id === tournament.id);

  if (index >= 0) {
    tournaments[index] = tournament;
  } else {
    tournaments.unshift(tournament);
  }

  await AsyncStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments));
}

export async function deleteTournament(id: string): Promise<void> {
  const tournaments = await getTournaments();
  const filtered = tournaments.filter(t => t.id !== id);
  await AsyncStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(filtered));
}

export async function clearAllTournaments(): Promise<void> {
  await AsyncStorage.removeItem(TOURNAMENTS_KEY);
}
