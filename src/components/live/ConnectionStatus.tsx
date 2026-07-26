import { memo } from 'react';
import type { LiveConnectionStatus } from '../../types/liveGame';

interface ConnectionStatusProps {
  status: LiveConnectionStatus;
  retryCount: number;
}

const statusConfig: Record<
  LiveConnectionStatus,
  { label: string; classes: string; animated: boolean }
> = {
  connecting: {
    label: 'Connecting',
    classes: 'border-amber-200 bg-amber-50 text-amber-800',
    animated: true,
  },
  connected: {
    label: 'Connected',
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    animated: false,
  },
  reconnecting: {
    label: 'Reconnecting',
    classes: 'border-cyan-200 bg-cyan-50 text-cyan-800',
    animated: true,
  },
  disconnected: {
    label: 'Disconnected',
    classes: 'border-slate-200 bg-slate-100 text-slate-700',
    animated: false,
  },
  error: {
    label: 'Connection error',
    classes: 'border-red-200 bg-red-50 text-red-800',
    animated: false,
  },
};

export const ConnectionStatus = memo(function ConnectionStatus({
  status,
  retryCount,
}: ConnectionStatusProps) {
  const config = statusConfig[status];
  const label =
    status === 'reconnecting' && retryCount > 0
      ? `${config.label} · attempt ${retryCount}`
      : config.label;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${config.classes}`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5">
        {config.animated ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-40" />
        ) : null}
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
      </span>
      {label}
    </div>
  );
});
