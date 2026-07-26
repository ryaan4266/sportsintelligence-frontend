import { memo } from 'react';
import type { TeamSummary } from '../../types/sports';
import { LiveGameStatus } from './LiveGameStatus';

interface LiveScoreBoardProps {
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
  homeScore: number;
  awayScore: number;
  quarter: number | null;
  timeRemaining: string | null;
  gameStatus: string | null;
}

export const LiveScoreBoard = memo(function LiveScoreBoard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  quarter,
  timeRemaining,
  gameStatus,
}: LiveScoreBoardProps) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/10"
      aria-label="Live scoreboard"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-5 sm:gap-8 sm:px-8 sm:py-7">
        <TeamScore team={awayTeam} score={awayScore} alignment="right" />
        <LiveGameStatus
          quarter={quarter}
          timeRemaining={timeRemaining}
          gameStatus={gameStatus}
        />
        <TeamScore team={homeTeam} score={homeScore} alignment="left" />
      </div>
      <div className="grid grid-cols-2 border-t border-slate-800 bg-slate-900/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:px-8">
        <span className="text-right pr-8">Away</span>
        <span className="pl-8">Home</span>
      </div>
    </section>
  );
});

interface TeamScoreProps {
  team: TeamSummary;
  score: number;
  alignment: 'left' | 'right';
}

function TeamScore({ team, score, alignment }: TeamScoreProps) {
  const alignmentClasses = alignment === 'right' ? 'items-end text-right' : 'items-start';

  return (
    <div className={`flex min-w-0 flex-col ${alignmentClasses}`}>
      <span className="truncate text-xs font-semibold text-slate-400 sm:text-sm">
        {team.city}
      </span>
      <span className="truncate text-lg font-black tracking-tight text-white sm:text-2xl">
        {team.abbreviation}
      </span>
      <span className="mt-2 font-mono text-4xl font-black tabular-nums text-white sm:text-6xl">
        {score}
      </span>
    </div>
  );
}
