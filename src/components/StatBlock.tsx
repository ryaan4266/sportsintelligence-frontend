interface StatBlockProps {
  label: string;
  value: string | number;
}

export function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-xl font-bold text-slate-950">{value}</dd>
    </div>
  );
}
