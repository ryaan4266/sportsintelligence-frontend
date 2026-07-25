import { getTeams } from '../api/sports';
import { PageHeader } from '../components/PageHeader';
import { TeamCard } from '../components/cards/TeamCard';
import { EmptyState, ErrorState, LoadingState } from '../components/status/RequestStates';
import { useApiResource } from '../hooks/useApiResource';

export function Teams() {
  const { data: teams, error, isLoading } = useApiResource(getTeams);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="League Directory"
        title="Teams"
        description="Explore team profiles, roster context, conference alignment, and division structure."
      />

      <div className="mt-10">
        {isLoading ? <LoadingState label="Loading teams..." /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && teams?.length === 0 ? (
          <EmptyState
            title="No teams found"
            description="The backend returned an empty teams collection."
          />
        ) : null}
        {!isLoading && !error && teams && teams.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
