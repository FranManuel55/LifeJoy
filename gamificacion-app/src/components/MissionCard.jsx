import React from 'react';
import { CheckCircle, XCircle, Edit, Trash2, Award } from 'lucide-react';
import { getCategoryColor } from '../utils/constants';

// Game-style color mapping
const MISSION_STYLES = {
  blue: {
    border: "hover:border-l-blue-500",
    badge: "bg-blue-500/10 text-blue-400",
    icon: "text-blue-400",
    button: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700",
  },
  red: {
    border: "hover:border-l-red-500",
    badge: "bg-red-500/10 text-red-400",
    icon: "text-red-400",
    button: "bg-red-600 hover:bg-red-500 active:bg-red-700",
  },
  amber: {
    border: "hover:border-l-amber-500",
    badge: "bg-amber-500/10 text-amber-400",
    icon: "text-amber-400",
    button: "bg-amber-600 hover:bg-amber-500 active:bg-amber-700",
  },
  emerald: {
    border: "hover:border-l-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-400",
    icon: "text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700",
  },
  violet: {
    border: "hover:border-l-violet-500",
    badge: "bg-violet-500/10 text-violet-400",
    icon: "text-violet-400",
    button: "bg-violet-600 hover:bg-violet-500 active:bg-violet-700",
  },
  cyan: {
    border: "hover:border-l-cyan-500",
    badge: "bg-cyan-500/10 text-cyan-400",
    icon: "text-cyan-400",
    button: "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700",
  },
  gray: {
    border: "hover:border-l-gray-500",
    badge: "bg-gray-500/10 text-gray-400",
    icon: "text-gray-400",
    button: "bg-gray-600 hover:bg-gray-500 active:bg-gray-700",
  }
};

const MissionCard = ({ mission, onComplete, onFail, onEdit, onDelete }) => {
  const colorKey = getCategoryColor(mission.category);
  const styles = MISSION_STYLES[colorKey] || MISSION_STYLES.gray;

  return (
    <div className={`group relative rounded-xl p-4 transition-all duration-200 border-l-4 border-l-transparent ${styles.border} ${mission.failed
      ? 'bg-emerald-950/30 border border-emerald-900/30'
      : 'bg-gray-900 border border-white/[0.06]'
      }`}>

      <div className="flex flex-col gap-3">
        {/* Header: Title and Actions */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`text-base font-bold transition-colors ${mission.failed ? 'text-gray-500 line-through' :
              mission.completed ? 'text-green-400 line-through' : 'text-white'
              }`}>
              {mission.title}
            </h3>
            {mission.description && (
              <p className="text-sm text-gray-500 mt-1">
                {mission.description}
              </p>
            )}
          </div>

          {/* Edit/Delete Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit?.(mission.id)}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete?.(mission.id)}
                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Footer: Rewards and Actions */}
        <div className="flex items-center justify-between">
          {/* Reward Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${styles.badge}`}>
            <Award className={`w-3.5 h-3.5 ${styles.icon}`} />
            <span className="text-xs font-bold">
              +{mission.reward} XP
            </span>
          </div>

          {/* Complete / Fail Buttons */}
          <div className="flex gap-2">
            {!mission.completed && !mission.failed && (
              <button
                onClick={() => onFail?.(mission.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/50 text-red-400/70 hover:bg-red-900/50 hover:text-red-400 transition-all active:scale-95"
                title="Fallar misión"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Fallar</span>
              </button>
            )}

            {mission.failed ? (
              <button
                onClick={() => onFail?.(mission.id)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/50 transition-colors active:scale-95"
                title="Click para desmarcar fallo"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Fallada</span>
              </button>
            ) : (
              <button
                onClick={() => onComplete?.(mission.id)}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-lg transition-all active:scale-95 ${mission.completed
                  ? 'bg-green-900/40 text-green-400'
                  : `${styles.button} text-white shadow-sm`
                  }`}
                title={mission.completed ? "Click para desmarcar" : "Completar"}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-bold">
                  {mission.completed ? "Hecho" : "Completar"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;