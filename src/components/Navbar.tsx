import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Teams', to: '/teams' },
  { label: 'Players', to: '/players' },
  { label: 'Games', to: '/games' },
];

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-950 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ');

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="text-lg font-semibold tracking-tight text-slate-950"
        >
          Athena Sports Intelligence
        </NavLink>

        <div className="flex flex-wrap gap-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={getNavLinkClassName}
            >
              {item.label}
            </NavLink>
          ))}
          {!isLoading && !isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className={getNavLinkClassName}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={getNavLinkClassName}
              >
                Register
              </NavLink>
            </>
          ) : null}
          {!isLoading && isAuthenticated ? (
            <>
              <NavLink
                to="/account"
                className={getNavLinkClassName}
              >
                Account
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
