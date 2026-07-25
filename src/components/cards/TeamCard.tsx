import { Link } from 'react-router';
import type { TeamSummary } from '../../types/sports';

interface TeamCardProps {
  team: TeamSummary;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            {team.abbreviation}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {team.city} {team.name}
          </h2>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {team.conference}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-600">{team.division} Division</p>
    </Link>
  );
}
