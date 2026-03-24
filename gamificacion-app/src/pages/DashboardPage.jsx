import Dashboard from "../components/Dashboard";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";
import {
  calculateTotalXp,
  calculateAverageLevel,
  calculateProgressToNextLevel
} from "../utils/gameMechanics";

/**
 * PASO FINAL: Conectando todo.
 * El container (Brain) prepara los datos y se los pasa al Presenter (Body).
 */
export default function DashboardPage() {
  const { gameState, loadingGame } = useGame();
  const { user, logout } = useAuth();
  const { life, categories } = gameState;

  if (loadingGame) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        <span className="ml-3 text-white font-medium">Cargando tu progreso...</span>
      </div>
    );
  }

  // 1. Calculamos los datos
  const totalXp = calculateTotalXp(categories);
  const averageLevel = calculateAverageLevel(categories);
  // OJO: PlayerCard espera "experience" como porcentaje (0-100) para la barra
  const progressPercent = calculateProgressToNextLevel(totalXp, averageLevel);

  // 2. Preparamos el objeto para PlayerCard
  // Nota: PlayerCard usa { player.level, player.experience (%), player.points }
  const playerData = {
    level: averageLevel,
    experience: progressPercent,
    points: totalXp
  };

  // 3. Renderizamos el componente visual limpio
  return (
    <Dashboard
      user={user}
      playerData={playerData}
      life={life}
      categories={categories}
      onLogout={logout}
    />
  );
}