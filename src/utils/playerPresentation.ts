import type { Player } from '../types/sports';

export interface PlayerProfilePresentation {
  description: string;
  division: string;
  eyebrow: string;
  jersey: string;
  teamAbbreviation: string;
}

export function formatJerseyNumber(jerseyNumber: number | null): string {
  return jerseyNumber === null ? 'N/A' : `#${jerseyNumber}`;
}

export function getPlayerProfilePresentation(
  player: Player,
): PlayerProfilePresentation {
  const jersey = formatJerseyNumber(player.jersey_number);

  if (!player.team) {
    return {
      description: 'Free Agent · No current team',
      division: 'N/A',
      eyebrow: `${player.position} · ${jersey}`,
      jersey,
      teamAbbreviation: 'Free Agent',
    };
  }

  return {
    description: `${player.team.city} ${player.team.name} · ${player.team.conference} Conference`,
    division: player.team.division,
    eyebrow: `${player.position} · ${jersey}`,
    jersey,
    teamAbbreviation: player.team.abbreviation,
  };
}
