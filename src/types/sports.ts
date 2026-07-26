export interface TeamSummary {
  id: number;
  name: string;
  city: string;
  abbreviation: string;
  conference: string;
  division: string;
}

export interface PlayerSummary {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  jersey_number: number;
  team_id: number;
}

export interface Player extends PlayerSummary {
  team: TeamSummary;
}

export interface TeamDetail extends TeamSummary {
  players: PlayerSummary[];
}

export interface Game {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
  game_date: string;
  status: string;
  home_team: TeamSummary;
  away_team: TeamSummary;
}

export interface PlayerGameStat {
  id: number;
  player_id: number;
  game_id: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  minutes: string;
  player: PlayerSummary;
}

export interface GameDetail extends Game {
  player_stats: PlayerGameStat[];
}

export interface TeamAnalytics {
  team_id: number;
  games_played: number;
  total_wins: number;
  total_losses: number;
  win_percentage: number;
  average_points_scored: number;
  average_points_allowed: number;
  average_point_differential: number;
}

export interface PlayerAnalytics {
  player_id: number;
  games_played: number;
  points_per_game: number;
  rebounds_per_game: number;
  assists_per_game: number;
  steals_per_game: number;
  turnovers_per_game: number;
  recent_five_points_per_game: number;
}

export type StatCategory = 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks';

export interface PlayerAnalyticsLeader {
  player_id: number;
  player_name: string;
  team_id: number;
}

export interface PlayerStatLeader extends PlayerAnalyticsLeader {
  category: StatCategory;
  value: number;
}

export interface StatisticalAdvantage {
  category: StatCategory;
  leading_player: PlayerAnalyticsLeader;
  leading_value: number;
  runner_up_value: number;
  advantage_margin: number;
}

export interface GameTeamComparison {
  home_team_id: number;
  away_team_id: number;
  home_team_points: number | null;
  away_team_points: number | null;
  winning_team_id: number | null;
  final_point_differential: number | null;
}

export interface GameAnalytics {
  game_id: number;
  top_scorer: PlayerStatLeader | null;
  biggest_individual_statistical_advantage: StatisticalAdvantage | null;
  team_comparison: GameTeamComparison;
}
