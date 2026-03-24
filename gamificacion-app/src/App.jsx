import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import Missions from "./pages/Missions";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";
import BottomNavbar from "./components/BottomNavbar";
import { useGame } from "./context/GameContext"; // Importamos useGame
import GameOverScreen from "./components/GameOverScreen"; // Importamos GameOver
import LevelUpModal from "./components/LevelUpModal"; // Importamos LevelUpModal
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import Rewards from "./pages/Rewards";

const App = () => {
  // Obtenemos el usuario y el estado de carga del Auth
  const { user, loading } = useAuth();

  // Obtenemos estado del juego para verificar Game Over
  // Nota: useGame solo funciona dentro de GameProvider, que está en main.jsx
  const { gameState, resetGame, levelUpData, closeLevelUpModal } = useGame();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Lógica de Game Over: Solo si hay usuario y vida <= 0
  if (user && gameState.life <= 0) {
    return <GameOverScreen onReset={resetGame} />;
  }

  return (
    <>
      {/* Modal de Level Up (Overlay) */}
      {levelUpData && (
        <LevelUpModal
          data={levelUpData}
          onClose={closeLevelUpModal}
        />
      )}

      <Routes>
        <Route
          path="/login"
          element={
            // Si ya hay usuario, redirigimos al dashboard
            // El signo ? es un operador ternario que actúa como un if-else
            user ? <Navigate to="/" /> : <Login />
          }
        />

        <Route
          path="/"
          element={
            // Si no hay usuario, volvemos al login
            user ? <DashboardPage /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/missions"
          element={
            // Solo usuarios logueados pueden ver misiones
            user ? <Missions /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/settings"
          element={
            user ? <Settings /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/calendar"
          element={
            user ? <Calendar /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/rewards"
          element={
            user ? <Rewards /> : <Navigate to="/login" />
          }
        />
      </Routes>
      {user && <BottomNavbar />}
    </>
  );
};

export default App;
