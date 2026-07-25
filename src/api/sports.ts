import apiClient from './client';
import type { Game, GameDetail, Player, TeamDetail, TeamSummary } from '../types/sports';

export async function getTeams(): Promise<TeamSummary[]> {
  const response = await apiClient.get<TeamSummary[]>('/teams');
  return response.data;
}

export async function getTeam(teamId: number): Promise<TeamDetail> {
  const response = await apiClient.get<TeamDetail>(`/teams/${teamId}`);
  return response.data;
}

export async function getPlayers(): Promise<Player[]> {
  const response = await apiClient.get<Player[]>('/players');
  return response.data;
}

export async function getPlayer(playerId: number): Promise<Player> {
  const response = await apiClient.get<Player>(`/players/${playerId}`);
  return response.data;
}

export async function getGames(): Promise<Game[]> {
  const response = await apiClient.get<Game[]>('/games');
  return response.data;
}

export async function getGame(gameId: number): Promise<GameDetail> {
  const response = await apiClient.get<GameDetail>(`/games/${gameId}`);
  return response.data;
}
