import { useNavigate } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatters';

export function Account() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Your account"
        title="Account"
        description="Review the basic details associated with your Athena account."
      />

      <div className="mt-10 max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="divide-y divide-slate-200">
          <div className="grid gap-1 py-4 first:pt-0 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">Email</dt>
            <dd className="break-all text-sm text-slate-950 sm:col-span-2">{user.email}</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">Created</dt>
            <dd className="text-sm text-slate-950 sm:col-span-2">
              {formatDate(user.created_at)}
            </dd>
          </div>
          <div className="grid gap-1 py-4 last:pb-0 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-slate-500">Status</dt>
            <dd className="text-sm text-slate-950 sm:col-span-2">
              {user.is_active ? 'Active' : 'Inactive'}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
        >
          Log out
        </button>
      </div>
    </section>
  );
}
