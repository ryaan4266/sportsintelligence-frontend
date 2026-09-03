import { Link } from 'react-router';
import type { Player, PlayerSummary, TeamSummary } from '../../types/sports';
import { formatJerseyNumber } from '../../utils/playerPresentation';

interface PlayerCardProps {
  player: Player | PlayerSummary;
  team?: TeamSummary;
}

export function PlayerCard({ player, team }: PlayerCardProps) {
  const resolvedTeam = 'team' in player ? player.team : team;

  return (
    <Link
      to={`/players/${player.id}`}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            {formatJerseyNumber(player.jersey_number)} · {player.position}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {player.first_name} {player.last_name}
          </h2>
        </div>
        {resolvedTeam ? (
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {resolvedTeam.abbreviation}
          </span>
        ) : null}
      </div>
      {resolvedTeam ? (
        <p className="mt-4 text-sm text-slate-600">
          {resolvedTeam.city} {resolvedTeam.name}
        </p>
      ) : (
        <p className="mt-4 text-sm text-slate-600">Free Agent</p>
      )}
    </Link>
  );
}
