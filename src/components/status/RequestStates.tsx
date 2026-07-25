interface LoadingStateProps {
  label?: string;
}

interface ErrorStateProps {
  message: string;
}

interface EmptyStateProps {
  title: string;
  description: string;
}

export function LoadingState({ label = 'Loading data...' }: LoadingStateProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-medium text-slate-600 shadow-sm">
      {label}
    </div>
  );
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800 shadow-sm">
      <p className="font-semibold">Unable to load data</p>
      <p className="mt-2 leading-6">{message}</p>
    </div>
  );
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
