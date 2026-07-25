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
