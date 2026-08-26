import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getRegistrationErrorMessage } from '../utils/authErrors';

export function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (password.length < 8 || password.length > 128) {
      setError('Password must be between 8 and 128 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim();
      await register({ email: normalizedEmail, password });
      navigate('/login', {
        replace: true,
        state: {
          registeredEmail: normalizedEmail,
          registrationSucceeded: true,
        },
      });
    } catch (caughtError) {
      setError(getRegistrationErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Join Athena
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Create an account
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Registration creates your account. You will sign in separately afterward.
        </p>

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
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              aria-describedby="password-help"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
            />
            <p id="password-help" className="mt-2 text-xs text-slate-500">
              Use 8 to 128 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-slate-800"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-800">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
