import type { LiveGameUpdate, LivePlayerStatChange } from '../types/liveGame';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type JsonObject = { [key: string]: JsonValue };
type LiveGameJsonObject = JsonObject & {
  game_id: number;
  quarter: number;
  time_remaining: string;
  home_score: number;
  away_score: number;
  recent_event: string;
  momentum_value: number;
  player_stat_changes: JsonValue[];
  status: string;
};

export function parseLiveGameUpdate(payload: string): LiveGameUpdate | null {
  try {
    const parsed = JSON.parse(payload) as JsonValue;
    if (!isJsonObject(parsed) || !hasLiveGameFields(parsed)) {
      return null;
    }

    const playerStatChanges = parsed.player_stat_changes;
    if (
      !Array.isArray(playerStatChanges) ||
      !playerStatChanges.every(isLivePlayerStatChange)
    ) {
      return null;
    }

    return {
      game_id: parsed.game_id,
      quarter: parsed.quarter,
      time_remaining: parsed.time_remaining,
      home_score: parsed.home_score,
      away_score: parsed.away_score,
      recent_event: parsed.recent_event,
      momentum_value: parsed.momentum_value,
      player_stat_changes: playerStatChanges,
      status: parsed.status,
    };
  } catch {
    return null;
  }
}

export function buildLiveGameWebSocketUrl(baseUrl: string, gameId: number): string {
  const normalizedBaseUrl = baseUrl.trim().replace(/\/+$/, '');

  try {
    const url = new URL(normalizedBaseUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    url.pathname = `${url.pathname.replace(/\/+$/, '')}/ws/games/${gameId}`;
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return `ws://localhost:8000/ws/games/${gameId}`;
  }
}

function hasLiveGameFields(value: JsonObject): value is LiveGameJsonObject {
  return (
    isNonNegativeInteger(value.game_id) &&
    isIntegerInRange(value.quarter, 1, 4) &&
    typeof value.time_remaining === 'string' &&
    isNonNegativeInteger(value.home_score) &&
    isNonNegativeInteger(value.away_score) &&
    typeof value.recent_event === 'string' &&
    isNumberInRange(value.momentum_value, -100, 100) &&
    Array.isArray(value.player_stat_changes) &&
    typeof value.status === 'string'
  );
}

function isLivePlayerStatChange(
  value: JsonValue,
): value is JsonObject & LivePlayerStatChange {
  if (!isJsonObject(value)) {
    return false;
  }

  return (
    isNonNegativeInteger(value.player_id) &&
    typeof value.player_name === 'string' &&
    isNonNegativeInteger(value.team_id) &&
    isNonNegativeInteger(value.points_delta) &&
    isNonNegativeInteger(value.rebounds_delta) &&
    isNonNegativeInteger(value.assists_delta) &&
    isNonNegativeInteger(value.steals_delta) &&
    isNonNegativeInteger(value.blocks_delta) &&
    isNonNegativeInteger(value.turnovers_delta) &&
    isNonNegativeInteger(value.points_total) &&
    isNonNegativeInteger(value.rebounds_total) &&
    isNonNegativeInteger(value.assists_total) &&
    isNonNegativeInteger(value.steals_total) &&
    isNonNegativeInteger(value.blocks_total) &&
    isNonNegativeInteger(value.turnovers_total)
  );
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonNegativeInteger(value: JsonValue): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function isIntegerInRange(
  value: JsonValue,
  minimum: number,
  maximum: number,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function isNumberInRange(
  value: JsonValue,
  minimum: number,
  maximum: number,
): value is number {
  return typeof value === 'number' && value >= minimum && value <= maximum;
}
