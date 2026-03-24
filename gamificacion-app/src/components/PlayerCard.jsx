import { useNavigate } from "react-router-dom";
import { TrendingUp, Award, Settings, Shield } from "lucide-react";

const PlayerCard = ({ user, player }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-md rounded-2xl bg-gray-900 border border-white/[0.06] text-white overflow-hidden">

      {/* Top colored accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />

      <div className="p-6 flex flex-col items-center text-center">

        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-500 hover:text-white"
        >
          <Settings size={18} />
        </button>

        {/* Avatar */}
        <div className="relative mb-4">
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-24 h-24 rounded-full border-3 border-amber-500/40 shadow-lg"
          />
          {/* Level badge on avatar */}
          <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-lg p-0.5">
            <div className="bg-amber-500 rounded-md px-2 py-0.5 flex items-center gap-1">
              <Shield className="w-3 h-3 text-gray-900" />
              <span className="text-xs font-black text-gray-900">{player.level}</span>
            </div>
          </div>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-white mb-1">
          {user.displayName}
        </h2>

        {/* Rank label */}
        <div className="flex items-center gap-2 mb-5">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-400 font-semibold">Nivel {player.level}</span>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Progreso XP</span>
            <span className="text-xs text-amber-400 font-bold">{player.experience}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${player.experience}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
            <TrendingUp className="w-3 h-3" />
            <span>Siguiente nivel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;