import { Navigate, Route, Routes } from 'react-router';
import { Navbar } from './components/Navbar';
import { GameDetail } from './pages/GameDetail';
import { Games } from './pages/Games';
import { Home } from './pages/Home';
import { LiveGamePage } from './pages/LiveGamePage';
import { PlayerDetail } from './pages/PlayerDetail';
import { Players } from './pages/Players';
import { TeamDetail } from './pages/TeamDetail';
import { Teams } from './pages/Teams';

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:playerId" element={<PlayerDetail />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:gameId/live" element={<LiveGamePage />} />
          <Route path="/games/:gameId" element={<GameDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
