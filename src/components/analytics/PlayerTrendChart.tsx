import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EmptyState } from '../status/RequestStates';

export interface PlayerTrendChartPoint {
  label: string;
  points: number;
}

interface PlayerTrendChartProps {
  data: PlayerTrendChartPoint[];
}

export function PlayerTrendChart({ data }: PlayerTrendChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No trend data available"
        description="Recent game averages will appear once the backend has enough player stat lines."
      />
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderColor: '#e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 20px rgb(15 23 42 / 0.08)',
            }}
          />
          <Line
            type="monotone"
            dataKey="points"
            stroke="#0891b2"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
