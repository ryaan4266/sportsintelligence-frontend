import { memo } from 'react';

interface RecentPlayCardProps {
  event: string | null;
  messageCount: number;
}

export const RecentPlayCard = memo(function RecentPlayCard({
  event,
  messageCount,
}: RecentPlayCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
          Latest play
        </h2>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          Live
        </span>
      </div>
      <div key={messageCount} className="live-event-enter mt-5 flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M13 2 4.5 13h6L9 22l8.5-12h-6L13 2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold leading-7 text-slate-950">
            {event ?? 'Waiting for the first play update…'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Updates appear here as soon as they are confirmed.
          </p>
        </div>
      </div>
    </section>
  );
});
