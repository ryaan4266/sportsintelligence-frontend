import { Link } from 'react-router';
import type { Game } from '../../types/sports';
import { formatGameDate, formatGameStatus, formatScore } from '../../utils/formatters';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            {formatGameDate(game.game_date)}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {game.away_team.abbreviation} at {game.home_team.abbreviation}
          </h2>
        </div>
        <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {formatGameStatus(game.status)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
        <span className="font-medium text-slate-700">
          {game.away_team.city} {game.away_team.name}
        </span>
        <span className="font-semibold text-slate-950">
          {formatScore(game.away_score)}
        </span>
        <span className="font-medium text-slate-700">
          {game.home_team.city} {game.home_team.name}
        </span>
        <span className="font-semibold text-slate-950">
          {formatScore(game.home_score)}
        </span>
      </div>
    </Link>
  );
}
