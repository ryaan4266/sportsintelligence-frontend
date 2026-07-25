import { getGames } from '../api/sports';
import { PageHeader } from '../components/PageHeader';
import { GameCard } from '../components/cards/GameCard';
import { EmptyState, ErrorState, LoadingState } from '../components/status/RequestStates';
import { useApiResource } from '../hooks/useApiResource';

export function Games() {
  const { data: games, error, isLoading } = useApiResource(getGames);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Schedule & Results"
        title="Games"
        description="Review upcoming and completed matchups with team context and score state."
      />

      <div className="mt-10">
        {isLoading ? <LoadingState label="Loading games..." /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && games?.length === 0 ? (
          <EmptyState
            title="No games found"
            description="The backend returned an empty games collection."
          />
        ) : null}
        {!isLoading && !error && games && games.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
