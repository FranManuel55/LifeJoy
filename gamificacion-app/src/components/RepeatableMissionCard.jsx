import React from 'react';
import { Repeat, XCircle, Edit, Trash2, Award, Plus, Check, RotateCcw } from 'lucide-react';
import { getCategoryColor } from '../utils/constants';

// Reusamos la misma paleta de colores que MissionCard
const MISSION_STYLES = {
    blue: {
        border: "border-l-blue-500",
        badge: "bg-blue-500/10 text-blue-400",
        icon: "text-blue-400",
        button: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700",
        progressBg: "bg-blue-900/30",
        progressFill: "bg-blue-500",
        dot: "border-blue-500",
        dotFilled: "bg-blue-500",
    },
    red: {
        border: "border-l-red-500",
        badge: "bg-red-500/10 text-red-400",
        icon: "text-red-400",
        button: "bg-red-600 hover:bg-red-500 active:bg-red-700",
        progressBg: "bg-red-900/30",
        progressFill: "bg-red-500",
        dot: "border-red-500",
        dotFilled: "bg-red-500",
    },
    amber: {
        border: "border-l-amber-500",
        badge: "bg-amber-500/10 text-amber-400",
        icon: "text-amber-400",
        button: "bg-amber-600 hover:bg-amber-500 active:bg-amber-700",
        progressBg: "bg-amber-900/30",
        progressFill: "bg-amber-500",
        dot: "border-amber-500",
        dotFilled: "bg-amber-500",
    },
    emerald: {
        border: "border-l-emerald-500",
        badge: "bg-emerald-500/10 text-emerald-400",
        icon: "text-emerald-400",
        button: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700",
        progressBg: "bg-emerald-900/30",
        progressFill: "bg-emerald-500",
        dot: "border-emerald-500",
        dotFilled: "bg-emerald-500",
    },
    violet: {
        border: "border-l-violet-500",
        badge: "bg-violet-500/10 text-violet-400",
        icon: "text-violet-400",
        button: "bg-violet-600 hover:bg-violet-500 active:bg-violet-700",
        progressBg: "bg-violet-900/30",
        progressFill: "bg-violet-500",
        dot: "border-violet-500",
        dotFilled: "bg-violet-500",
    },
    cyan: {
        border: "border-l-cyan-500",
        badge: "bg-cyan-500/10 text-cyan-400",
        icon: "text-cyan-400",
        button: "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700",
        progressBg: "bg-cyan-900/30",
        progressFill: "bg-cyan-500",
        dot: "border-cyan-500",
        dotFilled: "bg-cyan-500",
    },
    gray: {
        border: "border-l-gray-500",
        badge: "bg-gray-500/10 text-gray-400",
        icon: "text-gray-400",
        button: "bg-gray-600 hover:bg-gray-500 active:bg-gray-700",
        progressBg: "bg-gray-800",
        progressFill: "bg-gray-500",
        dot: "border-gray-500",
        dotFilled: "bg-gray-500",
    }
};

const FREQ_LABELS = {
    daily: "Diaria",
    weekly: "Semanal",
    monthly: "Mensual",
};

const RepeatableMissionCard = ({ mission, onIncrement, onDecrement, onFail, onEdit, onDelete }) => {
    const colorKey = getCategoryColor(mission.category);
    const styles = MISSION_STYLES[colorKey] || MISSION_STYLES.gray;

    const currentCount = mission.currentCount || 0;
    const targetCount = mission.targetCount || 1;
    const isCompleted = mission.completed;
    const isFailed = mission.failed;
    const progressPercent = Math.min(100, (currentCount / targetCount) * 100);

    return (
        <div className={`group relative rounded-xl p-4 transition-all duration-200 border-l-4 ${styles.border} ${isFailed
            ? 'bg-red-950/20 border border-red-900/30'
            : isCompleted
                ? 'bg-emerald-950/20 border border-emerald-900/30'
                : 'bg-gray-900 border border-white/[0.06]'
            }`}>

            <div className="flex flex-col gap-3">
                {/* Header: Title, Badge, Actions */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Repeat className={`w-3.5 h-3.5 ${styles.icon}`} />
                            <span className={`text-[10px] uppercase tracking-wider font-bold ${styles.icon}`}>
                                {FREQ_LABELS[mission.frequency] || "Repetible"} · {targetCount}x
                            </span>
                        </div>
                        <h3 className={`text-base font-bold transition-colors ${isFailed ? 'text-gray-500 line-through' :
                            isCompleted ? 'text-green-400' : 'text-white'
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

                {/* Progress Tabs/Segments */}
                <div className="flex flex-col gap-1.5 mt-1">
                    <div className="w-full flex gap-[2px] h-3 bg-gray-800 rounded-full overflow-hidden">
                        {Array.from({ length: targetCount }).map((_, i) => {
                            const isFilled = i < currentCount;
                            const fillClass = isCompleted ? 'bg-green-500' : isFailed ? 'bg-red-500/50' : styles.progressFill;
                            return (
                                <div
                                    key={i}
                                    className={`flex-1 transition-all duration-300 ${isFilled ? fillClass : 'bg-transparent'}`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex justify-end">
                        <span className={`text-xs font-bold ${isCompleted ? 'text-green-400' : isFailed ? 'text-red-400/50' : 'text-gray-400'}`}>
                            {currentCount}/{targetCount}
                        </span>
                    </div>
                </div>

                {/* Footer: Rewards and Actions */}
                <div className="flex items-center justify-between mt-1">
                    {/* Reward Badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${styles.badge}`}>
                        <Award className={`w-3.5 h-3.5 ${styles.icon}`} />
                        <span className="text-xs font-bold">
                            +{mission.reward} XP
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {!isCompleted && !isFailed && (
                            <button
                                onClick={() => onFail?.(mission.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/50 text-red-400/70 hover:bg-red-900/50 hover:text-red-400 transition-all active:scale-95"
                                title="Fallar misión"
                            >
                                <XCircle className="w-4 h-4" />
                                <span className="text-xs font-bold">Fallar</span>
                            </button>
                        )}

                        {isFailed ? (
                            <button
                                onClick={() => onFail?.(mission.id)}
                                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900/50 transition-colors active:scale-95"
                                title="Click para desmarcar fallo"
                            >
                                <XCircle className="w-4 h-4" />
                                <span className="text-xs font-bold">Fallada</span>
                            </button>
                        ) : isCompleted ? (
                            <button
                                onClick={() => onDecrement?.(mission.id)}
                                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-900/60 text-green-400 transition-all active:scale-95"
                                title="Click para desmarcar"
                            >
                                <Check className="w-4 h-4" />
                                <span className="text-xs font-bold">Completada</span>
                            </button>
                        ) : (
                            <div className="flex gap-1.5">
                                {currentCount > 0 && (
                                    <button
                                        onClick={() => onDecrement?.(mission.id)}
                                        className="flex items-center justify-center w-8 h-[31px] rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all active:scale-95"
                                        title="Deshacer progreso"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => onIncrement?.(mission.id)}
                                    className={`flex items-center gap-1 px-4 py-1.5 rounded-lg transition-all active:scale-95 ${styles.button} text-white shadow-sm`}
                                    title={`Registrar progreso (${currentCount}/${targetCount})`}
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-xs font-bold">Registrar</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepeatableMissionCard;
