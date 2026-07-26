import { memo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MomentumPoint } from '../../types/liveGame';

interface MomentumChartProps {
  data: MomentumPoint[];
  homeTeamLabel: string;
  awayTeamLabel: string;
}

export const MomentumChart = memo(function MomentumChart({
  data,
  homeTeamLabel,
  awayTeamLabel,
}: MomentumChartProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Game momentum</h2>
          <p className="mt-1 text-sm text-slate-500">Latest 30 live updates</p>
        </div>
        <div className="flex gap-3 text-xs font-semibold">
          <span className="text-cyan-700">+ {homeTeamLabel}</span>
          <span className="text-violet-700">− {awayTeamLabel}</span>
        </div>
      </div>

      <div className="mt-6 h-72 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 8 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                minTickGap={42}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[-100, 100]}
                ticks={[-100, -50, 0, 50, 100]}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Momentum',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#64748b',
                  fontSize: 11,
                }}
              />
              <Tooltip
                formatter={(value) => [formatMomentum(Number(value)), 'Momentum']}
                labelStyle={{ color: '#0f172a', fontWeight: 700 }}
                contentStyle={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgb(15 23 42 / 0.12)',
                }}
              />
              <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0891b2"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: '#0891b2', stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-500">
            Momentum will chart automatically when live updates arrive.
          </div>
        )}
      </div>
    </section>
  );
});

function formatMomentum(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}`;
}
