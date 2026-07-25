import { Link, Navigate, useParams } from 'react-router';
import { getPlayer } from '../api/sports';
import { PageHeader } from '../components/PageHeader';
import { StatBlock } from '../components/StatBlock';
import { ErrorState, LoadingState } from '../components/status/RequestStates';
import { useApiResource } from '../hooks/useApiResource';

export function PlayerDetail() {
  const { playerId } = useParams();
  const parsedPlayerId = Number(playerId);
  const hasValidPlayerId = Number.isInteger(parsedPlayerId);

  const {
    data: player,
    error,
    isLoading,
  } = useApiResource(
    () =>
      hasValidPlayerId
        ? getPlayer(parsedPlayerId)
        : Promise.reject(new Error('Invalid player id.')),
    [hasValidPlayerId, parsedPlayerId],
  );

  if (!hasValidPlayerId) {
    return <Navigate to="/players" replace />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {isLoading ? <LoadingState label="Loading player profile..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && player ? (
        <div>
          <PageHeader
            eyebrow={`${player.position} · #${player.jersey_number}`}
            title={`${player.first_name} ${player.last_name}`}
            description={`${player.team.city} ${player.team.name} · ${player.team.conference} Conference`}
            actions={
              <Link
                to="/players"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back to players
              </Link>
            }
          />

          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBlock label="Position" value={player.position} />
            <StatBlock label="Jersey" value={`#${player.jersey_number}`} />
            <StatBlock label="Team" value={player.team.abbreviation} />
            <StatBlock label="Division" value={player.team.division} />
          </dl>

          <div className="mt-12 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Team Context</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {player.first_name} {player.last_name} plays for the{' '}
              <Link
                to={`/teams/${player.team.id}`}
                className="font-semibold text-cyan-700 hover:text-cyan-800"
              >
                {player.team.city} {player.team.name}
              </Link>
              , competing in the {player.team.conference} Conference and{' '}
              {player.team.division} Division.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
