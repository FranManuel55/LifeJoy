import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { getCategoryColor } from '../utils/constants';

const CONFETTI_COLORS = {
    blue: ['#3b82f6', '#60a5fa', '#93c5fd'],
    red: ['#ef4444', '#f87171', '#fca5a5'],
    amber: ['#f59e0b', '#fbbf24', '#fcd34d'],
    emerald: ['#10b981', '#34d399', '#6ee7b7'],
    violet: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    cyan: ['#06b6d4', '#67e8f9', '#a5f3fc'],
    purple: ['#a855f7', '#c084fc', '#d8b4fe'],
};

const THEME_STYLES = {
    blue: { accent: "text-blue-400", bg: "bg-blue-500/15", button: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700" },
    red: { accent: "text-red-400", bg: "bg-red-500/15", button: "bg-red-600 hover:bg-red-500 active:bg-red-700" },
    amber: { accent: "text-amber-400", bg: "bg-amber-500/15", button: "bg-amber-600 hover:bg-amber-500 active:bg-amber-700" },
    emerald: { accent: "text-emerald-400", bg: "bg-emerald-500/15", button: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700" },
    violet: { accent: "text-violet-400", bg: "bg-violet-500/15", button: "bg-violet-600 hover:bg-violet-500 active:bg-violet-700" },
    cyan: { accent: "text-cyan-400", bg: "bg-cyan-500/15", button: "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700" },
    gray: { accent: "text-gray-400", bg: "bg-gray-500/15", button: "bg-gray-600 hover:bg-gray-500 active:bg-gray-700" },
};

const LevelUpModal = ({ data, onClose }) => {
    const { categoryKey, level, label } = data;
    const colorKey = getCategoryColor(categoryKey) || 'purple';
    const theme = THEME_STYLES[colorKey] || THEME_STYLES.gray;
    const confettiColors = CONFETTI_COLORS[colorKey] || CONFETTI_COLORS.purple;

    useEffect(() => {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: confettiColors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: confettiColors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, [confettiColors]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in bg-black/70">

            <div className="relative w-full max-w-sm rounded-2xl bg-gray-900 border border-white/[0.06] p-8 text-center animate-bounce-in overflow-hidden">

                {/* Icon */}
                <div className="relative mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-xl ${theme.bg} flex items-center justify-center`}>
                        <Trophy className={`w-9 h-9 ${theme.accent}`} />
                    </div>
                    <Star className="absolute -top-2 -right-2 w-7 h-7 text-amber-400 fill-amber-400" />
                    <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-white/40" />
                </div>

                <h2 className="text-3xl font-black text-white mb-1 tracking-tight">
                    ¡NIVEL SUBIDO!
                </h2>

                <p className={`text-sm font-bold uppercase tracking-widest mb-5 ${theme.accent}`}>
                    {label}
                </p>

                <div className="flex items-center justify-center mb-7">
                    <span className="text-6xl font-black text-white">
                        {level}
                    </span>
                </div>

                <button
                    onClick={onClose}
                    className={`w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-[0.98] ${theme.button}`}
                >
                    ¡GENIAL!
                </button>
            </div>
        </div>
    );
};

export default LevelUpModal;
