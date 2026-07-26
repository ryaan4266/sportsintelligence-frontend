import { memo } from 'react';

interface LiveGameStatusProps {
  quarter: number | null;
  timeRemaining: string | null;
  gameStatus: string | null;
}

export const LiveGameStatus = memo(function LiveGameStatus({
  quarter,
  timeRemaining,
  gameStatus,
}: LiveGameStatusProps) {
  const isCompleted = gameStatus === 'completed';
  const periodLabel = isCompleted
    ? 'Final'
    : quarter
      ? `Quarter ${quarter}`
      : 'Waiting for tip-off';

  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
        {periodLabel}
      </span>
      <span className="mt-1 font-mono text-2xl font-bold tabular-nums text-white sm:text-3xl">
        {isCompleted ? '00:00' : (timeRemaining ?? '--:--')}
      </span>
      <span className="mt-1 text-xs font-medium text-slate-400">
        {isCompleted ? 'Game complete' : 'Live game clock'}
      </span>
    </div>
  );
});
