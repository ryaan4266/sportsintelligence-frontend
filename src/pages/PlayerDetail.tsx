import { Link, Navigate, useParams } from 'react-router';
import { getPlayer, getPlayerAnalytics } from '../api/sports';
import { AnalyticsGrid } from '../components/analytics/AnalyticsGrid';
import { PlayerTrendChart } from '../components/analytics/PlayerTrendChart';
import { StatCard } from '../components/analytics/StatCard';
import { PageHeader } from '../components/PageHeader';
import { StatBlock } from '../components/StatBlock';
import { EmptyState, ErrorState, LoadingState } from '../components/status/RequestStates';
import { useApiResource } from '../hooks/useApiResource';
import { formatDecimal } from '../utils/formatters';

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
  const {
    data: analytics,
    error: analyticsError,
    isLoading: isAnalyticsLoading,
  } = useApiResource(
    () =>
      hasValidPlayerId
        ? getPlayerAnalytics(parsedPlayerId)
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

          <div className="mt-12">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                Analytics
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                Player Performance
              </h2>
            </div>
            {isAnalyticsLoading ? (
              <LoadingState label="Loading player analytics..." />
            ) : null}
            {analyticsError ? <ErrorState message={analyticsError} /> : null}
            {!isAnalyticsLoading && !analyticsError && !analytics ? (
              <EmptyState
                title="No analytics found"
                description="Player analytics are not available for this player yet."
              />
            ) : null}
            {!isAnalyticsLoading && !analyticsError && analytics ? (
              <div className="space-y-6">
                <AnalyticsGrid columns="four">
                  <StatCard
                    label="Points Per Game"
                    value={formatDecimal(analytics.points_per_game)}
                  />
                  <StatCard
                    label="Rebounds Per Game"
                    value={formatDecimal(analytics.rebounds_per_game)}
                  />
                  <StatCard
                    label="Assists Per Game"
                    value={formatDecimal(analytics.assists_per_game)}
                  />
                  <StatCard
                    label="Steals Per Game"
                    value={formatDecimal(analytics.steals_per_game)}
                  />
                  <StatCard
                    label="Turnovers Per Game"
                    value={formatDecimal(analytics.turnovers_per_game)}
                  />
                </AnalyticsGrid>

                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-slate-950">
                      Recent Five Game Average
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Available recent scoring average across up to five games.
                    </p>
                  </div>
                  <PlayerTrendChart
                    data={getPlayerTrendData(analytics.recent_five_points_per_game)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function getPlayerTrendData(recentFivePointsPerGame: number | null | undefined) {
  if (typeof recentFivePointsPerGame !== 'number' || !Number.isFinite(recentFivePointsPerGame)) {
    return [];
  }

  return [
    {
      label: 'Recent 5',
      points: recentFivePointsPerGame,
    },
  ];
}
