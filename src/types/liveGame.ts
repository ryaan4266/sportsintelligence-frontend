export type LiveConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

export interface LivePlayerStatChange {
  player_id: number;
  player_name: string;
  team_id: number;
  points_delta: number;
  rebounds_delta: number;
  assists_delta: number;
  steals_delta: number;
  blocks_delta: number;
  turnovers_delta: number;
  points_total: number;
  rebounds_total: number;
  assists_total: number;
  steals_total: number;
  blocks_total: number;
  turnovers_total: number;
}

export interface LiveGameUpdate {
  game_id: number;
  quarter: number;
  time_remaining: string;
  home_score: number;
  away_score: number;
  recent_event: string;
  momentum_value: number;
  player_stat_changes: LivePlayerStatChange[];
  status: string;
}

export interface MomentumPoint {
  sequence: number;
  label: string;
  value: number;
}

export interface LiveGameState {
  connectionStatus: LiveConnectionStatus;
  latestUpdate: LiveGameUpdate | null;
  momentumHistory: MomentumPoint[];
  playerStats: LivePlayerStatChange[];
  latestPlayerIds: number[];
  error: string | null;
  retryCount: number;
  messageCount: number;
}

export interface UseLiveGameOptions {
  enabled?: boolean;
  baseUrl?: string;
  initialRetryDelayMs?: number;
  maximumRetryDelayMs?: number;
  maximumRetries?: number;
}
