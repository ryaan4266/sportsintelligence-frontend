import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  helperText?: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, helperText, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </dt>
          <dd className="mt-2 text-2xl font-bold text-slate-950">{value}</dd>
        </div>
        {icon ? <div className="text-slate-400">{icon}</div> : null}
      </div>
      {helperText ? <p className="mt-3 text-sm leading-6 text-slate-600">{helperText}</p> : null}
    </div>
  );
}
