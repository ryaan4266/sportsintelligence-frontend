import { getPlayers } from '../api/sports';
import { PageHeader } from '../components/PageHeader';
import { PlayerCard } from '../components/cards/PlayerCard';
import { EmptyState, ErrorState, LoadingState } from '../components/status/RequestStates';
import { useApiResource } from '../hooks/useApiResource';

export function Players() {
  const { data: players, error, isLoading } = useApiResource(getPlayers);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Roster Intelligence"
        title="Players"
        description="Browse players with team context, positions, and profile-level navigation."
      />

      <div className="mt-10">
        {isLoading ? <LoadingState label="Loading players..." /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && players?.length === 0 ? (
          <EmptyState
            title="No players found"
            description="The backend returned an empty players collection."
          />
        ) : null}
        {!isLoading && !error && players && players.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
