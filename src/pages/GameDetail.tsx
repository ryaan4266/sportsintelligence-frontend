import { Link, Navigate, useParams } from 'react-router';
import { getGame } from '../api/sports';
import { PageHeader } from '../components/PageHeader';
import { StatBlock } from '../components/StatBlock';
import { EmptyState, ErrorState, LoadingState } from '../components/status/RequestStates';
import { useApiResource } from '../hooks/useApiResource';
import { formatGameDate, formatGameStatus, formatScore } from '../utils/formatters';

export function GameDetail() {
  const { gameId } = useParams();
  const parsedGameId = Number(gameId);
  const hasValidGameId = Number.isInteger(parsedGameId);

  const {
    data: game,
    error,
    isLoading,
  } = useApiResource(
    () =>
      hasValidGameId
        ? getGame(parsedGameId)
        : Promise.reject(new Error('Invalid game id.')),
    [hasValidGameId, parsedGameId],
  );

  if (!hasValidGameId) {
    return <Navigate to="/games" replace />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {isLoading ? <LoadingState label="Loading game details..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && game ? (
        <div>
          <PageHeader
            eyebrow={formatGameStatus(game.status)}
            title={`${game.away_team.abbreviation} at ${game.home_team.abbreviation}`}
            description={formatGameDate(game.game_date)}
            actions={
              <Link
                to="/games"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back to games
              </Link>
            }
          />

          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBlock label="Away Team" value={game.away_team.abbreviation} />
            <StatBlock label="Away Score" value={formatScore(game.away_score)} />
            <StatBlock label="Home Team" value={game.home_team.abbreviation} />
            <StatBlock label="Home Score" value={formatScore(game.home_score)} />
          </dl>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {[game.away_team, game.home_team].map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-cyan-300 hover:shadow-md"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                  {team.abbreviation}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  {team.city} {team.name}
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  {team.conference} Conference · {team.division} Division
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold text-slate-950">Player Stats</h2>
            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              {game.player_stats.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No stat lines found"
                    description="This game does not have player stats attached in the backend response."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Player</th>
                        <th className="px-4 py-3">MIN</th>
                        <th className="px-4 py-3">PTS</th>
                        <th className="px-4 py-3">REB</th>
                        <th className="px-4 py-3">AST</th>
                        <th className="px-4 py-3">STL</th>
                        <th className="px-4 py-3">BLK</th>
                        <th className="px-4 py-3">TO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {game.player_stats.map((stat) => (
                        <tr key={stat.id} className="text-slate-700">
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-950">
                            <Link
                              to={`/players/${stat.player.id}`}
                              className="hover:text-cyan-700"
                            >
                              {stat.player.first_name} {stat.player.last_name}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">{stat.minutes}</td>
                          <td className="whitespace-nowrap px-4 py-3">{stat.points}</td>
                          <td className="whitespace-nowrap px-4 py-3">{stat.rebounds}</td>
                          <td className="whitespace-nowrap px-4 py-3">{stat.assists}</td>
                          <td className="whitespace-nowrap px-4 py-3">{stat.steals}</td>
                          <td className="whitespace-nowrap px-4 py-3">{stat.blocks}</td>
                          <td className="whitespace-nowrap px-4 py-3">{stat.turnovers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
