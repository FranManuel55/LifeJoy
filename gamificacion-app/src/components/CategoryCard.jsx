import { getCategoryColor, CATEGORY_CONFIG } from "../utils/constants";
import { calculateProgressToNextLevel } from "../utils/gameMechanics";
import { Zap } from "lucide-react";

// Solid game-style color mapping
const COLOR_STYLES = {
    blue: {
        border: "border-l-blue-500",
        text: "text-blue-400",
        iconBg: "bg-blue-500/15",
        bar: "bg-blue-500",
        barTrack: "bg-blue-950",
    },
    red: {
        border: "border-l-red-500",
        text: "text-red-400",
        iconBg: "bg-red-500/15",
        bar: "bg-red-500",
        barTrack: "bg-red-950",
    },
    amber: {
        border: "border-l-amber-500",
        text: "text-amber-400",
        iconBg: "bg-amber-500/15",
        bar: "bg-amber-500",
        barTrack: "bg-amber-950",
    },
    emerald: {
        border: "border-l-emerald-500",
        text: "text-emerald-400",
        iconBg: "bg-emerald-500/15",
        bar: "bg-emerald-500",
        barTrack: "bg-emerald-950",
    },
    violet: {
        border: "border-l-violet-500",
        text: "text-violet-400",
        iconBg: "bg-violet-500/15",
        bar: "bg-violet-500",
        barTrack: "bg-violet-950",
    },
    cyan: {
        border: "border-l-cyan-500",
        text: "text-cyan-400",
        iconBg: "bg-cyan-500/15",
        bar: "bg-cyan-500",
        barTrack: "bg-cyan-950",
    },
    gray: {
        border: "border-l-slate-500",
        text: "text-slate-400",
        iconBg: "bg-slate-500/15",
        bar: "bg-slate-500",
        barTrack: "bg-slate-900",
    }
};

const CategoryCard = ({ categoryKey, category }) => {
    const progress = calculateProgressToNextLevel(category.xp, category.level);
    const colorName = getCategoryColor(categoryKey);
    const styles = COLOR_STYLES[colorName] || COLOR_STYLES.gray;
    const config = CATEGORY_CONFIG[categoryKey];
    const Icon = config?.icon || Zap;

    return (
        <div className={`group relative rounded-xl bg-gray-900 border border-white/[0.06] border-l-4 ${styles.border} p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800/80`}>

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${styles.iconBg} ${styles.text}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white">
                            {config?.label || category.label}
                        </h4>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${styles.text}`}>
                            Nivel {category.level}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black text-amber-400 block leading-none">
                        {category.xp}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                        XP
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Progreso</span>
                    <span className="text-[10px] text-gray-400 font-bold">{Math.round(progress)}%</span>
                </div>

                <div className={`w-full h-2.5 ${styles.barTrack} rounded-full overflow-hidden`}>
                    <div
                        className={`h-full rounded-full ${styles.bar} transition-all duration-500 ease-out`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;