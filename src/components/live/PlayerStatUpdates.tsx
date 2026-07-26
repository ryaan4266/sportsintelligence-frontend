import { memo, useMemo } from 'react';
import type { LivePlayerStatChange } from '../../types/liveGame';

interface PlayerStatUpdatesProps {
  players: LivePlayerStatChange[];
  latestPlayerIds: number[];
  homeTeamId: number;
  homeTeamLabel: string;
  awayTeamLabel: string;
}

export const PlayerStatUpdates = memo(function PlayerStatUpdates({
  players,
  latestPlayerIds,
  homeTeamId,
  homeTeamLabel,
  awayTeamLabel,
}: PlayerStatUpdatesProps) {
  const sortedPlayers = useMemo(
    () => [...players].sort((first, second) => second.points_total - first.points_total),
    [players],
  );
  const latestPlayerIdSet = useMemo(() => new Set(latestPlayerIds), [latestPlayerIds]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Player stat updates</h2>
          <p className="mt-1 text-sm text-slate-500">Running totals for active players</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {players.length} tracked
        </span>
      </div>

      {sortedPlayers.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">
          Player totals will appear after the first stat-changing play.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-5 py-3 sm:px-6">Player</th>
                <th className="px-3 py-3 text-center">PTS</th>
                <th className="px-3 py-3 text-center">REB</th>
                <th className="px-3 py-3 text-center">AST</th>
                <th className="px-3 py-3 text-center">STL</th>
                <th className="px-3 py-3 text-center">BLK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedPlayers.map((player) => {
                const isLatest = latestPlayerIdSet.has(player.player_id);
                const teamLabel =
                  player.team_id === homeTeamId ? homeTeamLabel : awayTeamLabel;

                return (
                  <tr
                    key={player.player_id}
                    className={`transition-colors ${isLatest ? 'bg-cyan-50/70' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${isLatest ? 'animate-pulse bg-cyan-500' : 'bg-slate-300'}`}
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{player.player_name}</p>
                          <p className="text-xs font-medium text-slate-500">{teamLabel}</p>
                        </div>
                      </div>
                    </td>
                    <StatCell value={player.points_total} delta={player.points_delta} active={isLatest} />
                    <StatCell value={player.rebounds_total} delta={player.rebounds_delta} active={isLatest} />
                    <StatCell value={player.assists_total} delta={player.assists_delta} active={isLatest} />
                    <StatCell value={player.steals_total} delta={player.steals_delta} active={isLatest} />
                    <StatCell value={player.blocks_total} delta={player.blocks_delta} active={isLatest} />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
});

interface StatCellProps {
  value: number;
  delta: number;
  active: boolean;
}

function StatCell({ value, delta, active }: StatCellProps) {
  return (
    <td className="px-3 py-4 text-center font-mono font-semibold tabular-nums text-slate-800">
      {value}
      {active && delta > 0 ? (
        <span className="ml-1 text-[10px] font-bold text-cyan-700">+{delta}</span>
      ) : null}
    </td>
  );
}
