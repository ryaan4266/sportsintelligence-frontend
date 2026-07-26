import { Link, Navigate, useParams } from 'react-router';
import { getTeam, getTeamAnalytics } from '../api/sports';
import { AnalyticsGrid } from '../components/analytics/AnalyticsGrid';
import { StatCard } from '../components/analytics/StatCard';
import { PageHeader } from '../components/PageHeader';
import { StatBlock } from '../components/StatBlock';
import { PlayerCard } from '../components/cards/PlayerCard';
import { EmptyState, ErrorState, LoadingState } from '../components/status/RequestStates';
import { useApiResource } from '../hooks/useApiResource';
import { formatPercentage, formatStatValue } from '../utils/formatters';

export function TeamDetail() {
  const { teamId } = useParams();
  const parsedTeamId = Number(teamId);
  const hasValidTeamId = Number.isInteger(parsedTeamId);

  const {
    data: team,
    error,
    isLoading,
  } = useApiResource(
    () =>
      hasValidTeamId
        ? getTeam(parsedTeamId)
        : Promise.reject(new Error('Invalid team id.')),
    [hasValidTeamId, parsedTeamId],
  );
  const {
    data: analytics,
    error: analyticsError,
    isLoading: isAnalyticsLoading,
  } = useApiResource(
    () =>
      hasValidTeamId
        ? getTeamAnalytics(parsedTeamId)
        : Promise.reject(new Error('Invalid team id.')),
    [hasValidTeamId, parsedTeamId],
  );

  if (!hasValidTeamId) {
    return <Navigate to="/teams" replace />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {isLoading ? <LoadingState label="Loading team profile..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!isLoading && !error && team ? (
        <div>
          <PageHeader
            eyebrow={team.abbreviation}
            title={`${team.city} ${team.name}`}
            description={`${team.conference} Conference · ${team.division} Division`}
            actions={
              <Link
                to="/teams"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back to teams
              </Link>
            }
          />

          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            <StatBlock label="Conference" value={team.conference} />
            <StatBlock label="Division" value={team.division} />
            <StatBlock label="Roster Size" value={team.players.length} />
          </dl>

          <div className="mt-12">
            <h2 className="text-xl font-semibold text-slate-950">Roster</h2>
            <div className="mt-5">
              {team.players.length === 0 ? (
                <EmptyState
                  title="No players found"
                  description="This team does not have players attached in the backend response."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {team.players.map((player) => (
                    <PlayerCard key={player.id} player={player} team={team} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                Analytics
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                Team Performance
              </h2>
            </div>
            {isAnalyticsLoading ? (
              <LoadingState label="Loading team analytics..." />
            ) : null}
            {analyticsError ? <ErrorState message={analyticsError} /> : null}
            {!isAnalyticsLoading && !analyticsError && !analytics ? (
              <EmptyState
                title="No analytics found"
                description="Team analytics are not available for this team yet."
              />
            ) : null}
            {!isAnalyticsLoading && !analyticsError && analytics ? (
              <AnalyticsGrid>
                <StatCard label="Wins" value={analytics.total_wins} />
                <StatCard label="Losses" value={analytics.total_losses} />
                <StatCard
                  label="Win Percentage"
                  value={formatPercentage(analytics.win_percentage)}
                />
                <StatCard
                  label="Avg Points Scored"
                  value={formatStatValue(analytics.average_points_scored)}
                />
                <StatCard
                  label="Avg Points Allowed"
                  value={formatStatValue(analytics.average_points_allowed)}
                />
                <StatCard
                  label="Point Differential"
                  value={formatStatValue(analytics.average_point_differential)}
                />
              </AnalyticsGrid>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
