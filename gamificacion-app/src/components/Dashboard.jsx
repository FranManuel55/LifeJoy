import { useNavigate } from "react-router-dom";
import PlayerCard from "./PlayerCard";
import CategoryCard from "./CategoryCard";
import DailySummaryModal from "./DailySummaryModal";
import { useGame } from "../context/GameContext";

const Dashboard = ({ user, playerData, life, categories }) => {
  const navigate = useNavigate();
  const { dailyReport, closeDailyReport } = useGame();

  return (
    <div className="min-h-screen bg-[#0a0e1a] py-8 px-4 pb-32 flex flex-col items-center overflow-y-auto">

      {/* Daily Summary Modal */}
      <DailySummaryModal
        report={dailyReport}
        onClose={closeDailyReport}
      />

      <div className="mb-6 flex items-center gap-3">
        <span className="text-3xl">⚔️</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="mb-8 w-full max-w-md">
        <PlayerCard user={user} player={playerData} />
      </div>

      <div className="w-full max-w-4xl mb-10">
        <div className="flex items-center gap-2 mb-4 px-1">
          <span className="text-lg">🗂️</span>
          <h3 className="text-sm text-gray-400 uppercase tracking-widest font-bold">Tus Áreas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(categories)
            .filter(([_, cat]) => cat.isActive !== false)
            .map(([key, cat]) => (
              <CategoryCard key={key} categoryKey={key} category={cat} />
            ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
