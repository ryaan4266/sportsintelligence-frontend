import type {
  AIGameAnalysisRequest,
  AIPlayerStatistics,
  AITeamStatistics,
} from '../types/ai';
import type { LiveGameUpdate, LivePlayerStatChange } from '../types/liveGame';
import type { GameDetail, TeamSummary } from '../types/sports';

interface PlayerStatSnapshot extends AIPlayerStatistics {
  playerId: number;
}

export function buildGameDetailAnalysisRequest(
  game: GameDetail,
): AIGameAnalysisRequest | null {
  return buildAnalysisRequest(game, createGameDetailSnapshots(game), null);
}

export function buildLiveGameAnalysisRequest(
  game: GameDetail,
  update: LiveGameUpdate | null,
  livePlayerStats: LivePlayerStatChange[],
  recentEvents: string[],
): AIGameAnalysisRequest | null {
  const snapshots = new Map(
    createGameDetailSnapshots(game).map((player) => [
      player.playerId,
      player,
    ]),
  );

  livePlayerStats.forEach((player) => {
    const team = getTeamById(game, player.team_id);
    if (!team) return;

    const existingPlayer = snapshots.get(player.player_id);
    snapshots.set(player.player_id, {
      playerId: player.player_id,
      player_name: sanitizeName(player.player_name),
      team_name: getTeamLabel(team),
      points: player.points_total,
      rebounds: player.rebounds_total,
      assists: player.assists_total,
      steals: player.steals_total,
      blocks: player.blocks_total,
      turnovers: player.turnovers_total,
      minutes: existingPlayer?.minutes,
    });
  });

  return buildAnalysisRequest(
    game,
    Array.from(snapshots.values()),
    update,
    recentEvents,
  );
}

function buildAnalysisRequest(
  game: GameDetail,
  snapshots: PlayerStatSnapshot[],
  update: LiveGameUpdate | null,
  recentEvents: string[] = [],
): AIGameAnalysisRequest | null {
  if (snapshots.length === 0) return null;

  const homeTeamName = getTeamLabel(game.home_team);
  const awayTeamName = getTeamLabel(game.away_team);
  const playerStats = snapshots.map(toPlayerStatistics);

  return {
    game_id: game.id,
    current_score: {
      home_team: homeTeamName,
      away_team: awayTeamName,
      home_score: update?.home_score ?? game.home_score ?? 0,
      away_score: update?.away_score ?? game.away_score ?? 0,
    },
    recent_events: recentEvents
      .map((event) => event.trim().slice(0, 500))
      .filter((event) => event.length > 0)
      .slice(-50),
    team_stats: {
      [homeTeamName]: aggregateTeamStats(playerStats, homeTeamName),
      [awayTeamName]: aggregateTeamStats(playerStats, awayTeamName),
    },
    player_stats: playerStats,
  };
}

function createGameDetailSnapshots(game: GameDetail): PlayerStatSnapshot[] {
  return game.player_stats.flatMap((stat) => {
    const team = getTeamById(game, stat.player.team_id);
    if (!team) return [];

    const minutes = Number(stat.minutes);

    return [{
      playerId: stat.player_id,
      player_name: sanitizeName(
        `${stat.player.first_name} ${stat.player.last_name}`,
      ),
      team_name: getTeamLabel(team),
      points: stat.points,
      rebounds: stat.rebounds,
      assists: stat.assists,
      steals: stat.steals,
      blocks: stat.blocks,
      turnovers: stat.turnovers,
      minutes: Number.isFinite(minutes) && minutes >= 0 && minutes <= 80
        ? minutes
        : undefined,
    }];
  });
}

function toPlayerStatistics(snapshot: PlayerStatSnapshot): AIPlayerStatistics {
  return {
    player_name: snapshot.player_name,
    team_name: snapshot.team_name,
    points: snapshot.points,
    rebounds: snapshot.rebounds,
    assists: snapshot.assists,
    steals: snapshot.steals,
    blocks: snapshot.blocks,
    turnovers: snapshot.turnovers,
    minutes: snapshot.minutes,
  };
}

function aggregateTeamStats(
  players: AIPlayerStatistics[],
  teamName: string,
): AITeamStatistics {
  const teamPlayers = players.filter((player) => player.team_name === teamName);

  return {
    rebounds: sum(teamPlayers, 'rebounds'),
    assists: sum(teamPlayers, 'assists'),
    steals: sum(teamPlayers, 'steals'),
    blocks: sum(teamPlayers, 'blocks'),
    turnovers: sum(teamPlayers, 'turnovers'),
  };
}

function sum(
  players: AIPlayerStatistics[],
  field: 'rebounds' | 'assists' | 'steals' | 'blocks' | 'turnovers',
): number {
  return players.reduce((total, player) => total + player[field], 0);
}

function getTeamById(game: GameDetail, teamId: number): TeamSummary | null {
  if (teamId === game.home_team.id) return game.home_team;
  if (teamId === game.away_team.id) return game.away_team;
  return null;
}

function getTeamLabel(team: TeamSummary): string {
  const fullName = `${team.city} ${team.name}`.trim();
  return (fullName || team.abbreviation.trim()).slice(0, 100);
}

function sanitizeName(name: string): string {
  return name.trim().slice(0, 100);
}
