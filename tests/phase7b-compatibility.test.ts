import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildGameDetailAnalysisRequest,
  getGameTeamAbbreviation,
  resolvePlayerStatTeamId,
} from '../src/utils/gameAnalysis.ts';
import {
  formatJerseyNumber,
  getPlayerProfilePresentation,
} from '../src/utils/playerPresentation.ts';
import type { GameDetail, Player } from '../src/types/sports.ts';

const homeTeam = {
  id: 1,
  name: 'Huskies',
  city: 'Toronto',
  abbreviation: 'TOR',
  conference: 'East',
  division: 'Atlantic',
};

const awayTeam = {
  id: 2,
  name: 'Grizzlies',
  city: 'Vancouver',
  abbreviation: 'VAN',
  conference: 'West',
  division: 'Pacific',
};

function createGame(statTeamId: number | null, playerTeamId: number | null): GameDetail {
  return {
    id: 10,
    home_team_id: homeTeam.id,
    away_team_id: awayTeam.id,
    home_score: 100,
    away_score: 98,
    game_date: '2026-01-01T00:00:00Z',
    status: 'final',
    home_team: homeTeam,
    away_team: awayTeam,
    player_stats: [{
      id: 20,
      player_id: 30,
      game_id: 10,
      team_id: statTeamId,
      points: 12,
      rebounds: 5,
      assists: 4,
      steals: 1,
      blocks: 0,
      turnovers: 2,
      minutes: '28',
      player: {
        id: 30,
        first_name: 'Test',
        last_name: 'Player',
        position: 'G',
        jersey_number: null,
        team_id: playerTeamId,
      },
    }],
  };
}

test('free-agent presentation is safe and explicit', () => {
  const player: Player = {
    id: 30,
    first_name: 'Test',
    last_name: 'Player',
    position: 'G',
    jersey_number: null,
    team_id: null,
    team: null,
  };

  assert.deepEqual(getPlayerProfilePresentation(player), {
    description: 'Free Agent · No current team',
    division: 'N/A',
    eyebrow: 'G · N/A',
    jersey: 'N/A',
    teamAbbreviation: 'Free Agent',
  });
});

test('null jersey numbers render without a hash-prefixed null', () => {
  assert.equal(formatJerseyNumber(null), 'N/A');
  assert.equal(formatJerseyNumber(23), '#23');
});

test('game-time team attribution overrides the current player team', () => {
  assert.equal(resolvePlayerStatTeamId(awayTeam.id, homeTeam.id), awayTeam.id);
  assert.equal(
    buildGameDetailAnalysisRequest(createGame(awayTeam.id, homeTeam.id))
      ?.player_stats[0]?.team_name,
    'Vancouver Grizzlies',
  );
});

test('legacy stats fall back to the current player team', () => {
  assert.equal(resolvePlayerStatTeamId(null, homeTeam.id), homeTeam.id);
  assert.equal(
    buildGameDetailAnalysisRequest(createGame(null, homeTeam.id))
      ?.player_stats[0]?.team_name,
    'Toronto Huskies',
  );
});

test('missing historical and current team IDs are handled safely', () => {
  assert.equal(resolvePlayerStatTeamId(null, null), null);
  assert.equal(buildGameDetailAnalysisRequest(createGame(null, null)), null);
});

test('nullable analytics leader team attribution renders safely', () => {
  assert.equal(getGameTeamAbbreviation(null, createGame(null, null)), 'No team');
});
