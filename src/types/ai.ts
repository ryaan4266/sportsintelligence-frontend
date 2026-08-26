export interface AICurrentScore {
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
}

export interface AITeamStatistics {
  field_goal_percentage?: number | null;
  three_point_percentage?: number | null;
  free_throw_percentage?: number | null;
  rebounds?: number | null;
  offensive_rebounds?: number | null;
  assists?: number | null;
  steals?: number | null;
  blocks?: number | null;
  turnovers?: number | null;
  fouls?: number | null;
  points_in_paint?: number | null;
  fast_break_points?: number | null;
}

export interface AIPlayerStatistics {
  player_name: string;
  team_name: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  minutes?: number | null;
}

export interface AIGameAnalysisRequest {
  game_id: number;
  current_score: AICurrentScore;
  recent_events: string[];
  team_stats: Record<string, AITeamStatistics>;
  player_stats: AIPlayerStatistics[];
}

export interface AIGameAnalysisResponse {
  summary: string;
  winning_reasons: [string, string, string];
  improvement_areas: [string, string, string];
  standout_player: string;
  prediction: string;
}
