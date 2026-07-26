import type { ReactNode } from 'react';

interface AnalyticsGridProps {
  children: ReactNode;
  columns?: 'three' | 'four';
}

export function AnalyticsGrid({ children, columns = 'three' }: AnalyticsGridProps) {
  const columnClass =
    columns === 'four' ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';

  return <dl className={`grid gap-4 ${columnClass}`}>{children}</dl>;
}
