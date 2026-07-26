import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EmptyState } from '../status/RequestStates';

export interface TeamComparisonChartPoint {
  metric: string;
  home: number;
  away: number;
}

interface TeamComparisonChartProps {
  data: TeamComparisonChartPoint[];
  homeLabel: string;
  awayLabel: string;
}

export function TeamComparisonChart({ data, homeLabel, awayLabel }: TeamComparisonChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No comparison data available"
        description="Team comparison metrics will appear once game analytics are available."
      />
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="metric"
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
          <Legend formatter={(value) => (value === 'home' ? homeLabel : awayLabel)} />
          <Bar dataKey="away" name="away" fill="#64748b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="home" name="home" fill="#0891b2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
