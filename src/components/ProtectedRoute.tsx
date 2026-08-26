import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading, retrySession, sessionError } = useAuth();

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-medium text-slate-600 shadow-sm">
          Verifying your session...
        </div>
      </section>
    );
  }

  if (sessionError) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <h1 className="font-semibold">Unable to verify your session</h1>
          <p className="mt-2 text-sm leading-6">{sessionError}</p>
          <button
            type="button"
            onClick={() => void retrySession()}
            className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    const destination = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" replace state={{ from: destination }} />;
  }

  return <Outlet />;
}
