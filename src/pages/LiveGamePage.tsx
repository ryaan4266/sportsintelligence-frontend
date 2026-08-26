import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { getGame } from '../api/sports';
import { AIGameAnalysisPanel } from '../components/ai/AIGameAnalysisPanel';
import { ConnectionStatus } from '../components/live/ConnectionStatus';
import { LiveScoreBoard } from '../components/live/LiveScoreBoard';
import { MomentumChart } from '../components/live/MomentumChart';
import { PlayerStatUpdates } from '../components/live/PlayerStatUpdates';
import { RecentPlayCard } from '../components/live/RecentPlayCard';
import { ErrorState, LoadingState } from '../components/status/RequestStates';
import { useApiResource } from '../hooks/useApiResource';
import { useLiveGame } from '../hooks/useLiveGame';
import { buildLiveGameAnalysisRequest } from '../utils/gameAnalysis';

export function LiveGamePage() {
  const { gameId } = useParams();
  const parsedGameId = Number(gameId);
  const hasValidGameId = Number.isInteger(parsedGameId) && parsedGameId > 0;
  const safeGameId = hasValidGameId ? parsedGameId : 0;
  const {
    data: game,
    error: gameError,
    isLoading: isGameLoading,
  } = useApiResource(
    () =>
      hasValidGameId
        ? getGame(parsedGameId)
        : Promise.reject(new Error('Enter a valid numeric game id.')),
    [hasValidGameId, parsedGameId],
  );
  const liveGame = useLiveGame(safeGameId, {
    enabled: hasValidGameId && Boolean(game) && !gameError,
  });
  const analysisRequest = useMemo(
    () =>
      game
        ? buildLiveGameAnalysisRequest(
            game,
            liveGame.latestUpdate,
            liveGame.playerStats,
            liveGame.recentEvents,
          )
        : null,
    [
      game,
      liveGame.latestUpdate,
      liveGame.playerStats,
      liveGame.recentEvents,
    ],
  );

  if (!hasValidGameId) {
    return (
      <DashboardShell>
        <ErrorState message="This live dashboard needs a valid numeric game id." />
        <BackToGamesLink />
      </DashboardShell>
    );
  }

  if (isGameLoading) {
    return (
      <DashboardShell>
        <LoadingState label="Preparing the live game dashboard..." />
      </DashboardShell>
    );
  }

  if (gameError || !game) {
    return (
      <DashboardShell>
        <ErrorState message={gameError ?? 'This game could not be loaded.'} />
        <BackToGamesLink />
      </DashboardShell>
    );
  }

  const update = liveGame.latestUpdate;
  const homeScore = update?.home_score ?? game.home_score ?? 0;
  const awayScore = update?.away_score ?? game.away_score ?? 0;

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">
            Live Game Center
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {game.away_team.city} {game.away_team.name} at {game.home_team.city}{' '}
            {game.home_team.name}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Scores, momentum, and player production update in real time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ConnectionStatus
            status={liveGame.connectionStatus}
            retryCount={liveGame.retryCount}
          />
          <Link
            to={`/games/${game.id}`}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Game details
          </Link>
        </div>
      </div>

      <div className="sticky top-3 z-20 mt-8">
        <LiveScoreBoard
          homeTeam={game.home_team}
          awayTeam={game.away_team}
          homeScore={homeScore}
          awayScore={awayScore}
          quarter={update?.quarter ?? null}
          timeRemaining={update?.time_remaining ?? null}
          gameStatus={update?.status ?? game.status}
        />
      </div>

      {liveGame.error ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">Live update notice:</span> {liveGame.error}
        </div>
      ) : null}

      {liveGame.connectionStatus === 'connected' && !update ? (
        <div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          Connected successfully. Waiting for the first game update…
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <MomentumChart
          data={liveGame.momentumHistory}
          homeTeamLabel={game.home_team.abbreviation}
          awayTeamLabel={game.away_team.abbreviation}
        />
        <RecentPlayCard event={update?.recent_event ?? null} messageCount={liveGame.messageCount} />
      </div>

      <div className="mt-6">
        <PlayerStatUpdates
          players={liveGame.playerStats}
          latestPlayerIds={liveGame.latestPlayerIds}
          homeTeamId={game.home_team.id}
          homeTeamLabel={game.home_team.abbreviation}
          awayTeamLabel={game.away_team.abbreviation}
        />
      </div>

      <div className="mt-6">
        <AIGameAnalysisPanel key={game.id} request={analysisRequest} />
      </div>
    </DashboardShell>
  );
}

interface DashboardShellProps {
  children: React.ReactNode;
}

function DashboardShell({ children }: DashboardShellProps) {
  return (
    <section className="min-h-[calc(100vh-73px)] bg-[radial-gradient(circle_at_top_right,_rgba(8,145,178,0.09),_transparent_28rem)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">{children}</div>
    </section>
  );
}

function BackToGamesLink() {
  return (
    <Link
      to="/games"
      className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      Back to games
    </Link>
  );
}
