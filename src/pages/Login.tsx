import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getLoginErrorMessage } from '../utils/authErrors';

interface LoginLocationState {
  from?: string;
  registeredEmail?: string;
  registrationSucceeded?: boolean;
}

export function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();
  const locationState = getLoginLocationState(location.state);
  const [email, setEmail] = useState(locationState.registeredEmail ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (locationState.registeredEmail) {
      setEmail(locationState.registeredEmail);
    }
  }, [locationState.registeredEmail]);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={locationState.from ?? '/account'} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate(locationState.from ?? '/account', { replace: true });
    } catch (caughtError) {
      setError(getLoginErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Your account
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Access your Athena account without interrupting the public sports experience.
        </p>

        {locationState.registrationSucceeded ? (
          <div
            role="status"
            className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            Your account was created. Sign in to continue.
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        ) : null}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-800">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-800">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to Athena?{' '}
          <Link to="/register" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

function getLoginLocationState(state: unknown): LoginLocationState {
  if (!state || typeof state !== 'object') return {};

  const candidate = state as Record<string, unknown>;
  return {
    from: isSafeInternalPath(candidate.from) ? candidate.from : undefined,
    registeredEmail:
      typeof candidate.registeredEmail === 'string'
        ? candidate.registeredEmail
        : undefined,
    registrationSucceeded: candidate.registrationSucceeded === true,
  };
}

function isSafeInternalPath(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
}
