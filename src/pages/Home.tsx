import { Link } from 'react-router';

const featureLinks = [
  {
    title: 'Teams',
    description: 'Explore team profiles, roster context, and performance foundations.',
    to: '/teams',
  },
  {
    title: 'Players',
    description: 'Browse player views designed for deeper future statistical layers.',
    to: '/players',
  },
  {
    title: 'Games',
    description: 'Review game-centered entry points ready for schedules and results.',
    to: '/games',
  },
];

export function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Basketball Analytics
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Athena Sports Intelligence
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          A modern basketball analytics platform for exploring teams, players,
          games, and advanced statistics.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {featureLinks.map((feature) => (
          <Link
            key={feature.to}
            to={feature.to}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-950">{feature.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
