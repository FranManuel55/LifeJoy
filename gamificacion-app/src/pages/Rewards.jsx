import { Gift, Coins, Lock, Star, ShoppingBag, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';

// Placeholder rewards data — will be connected to real game economy later
const SAMPLE_REWARDS = [
    {
        id: 1,
        title: "Día Libre",
        description: "Salta todas las misiones por un día sin penalización",
        cost: 500,
        icon: Star,
        color: "amber",
        unlocked: false,
    },
    {
        id: 2,
        title: "Escudo Protector",
        description: "Reduce el daño de fallos a la mitad durante 24h",
        cost: 300,
        icon: Gift,
        color: "violet",
        unlocked: false,
    },
    {
        id: 3,
        title: "Poción de Vida",
        description: "Restaura +15 de vida instantáneamente",
        cost: 200,
        icon: Gift,
        color: "red",
        unlocked: false,
    },
    {
        id: 4,
        title: "Multiplicador XP",
        description: "Duplica la XP ganada durante 24h",
        cost: 750,
        icon: Trophy,
        color: "cyan",
        unlocked: false,
    },
];

const COLOR_MAP = {
    amber: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-l-amber-500" },
    violet: { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-l-violet-500" },
    red: { bg: "bg-red-500/15", text: "text-red-400", border: "border-l-red-500" },
    cyan: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-l-cyan-500" },
};

const Rewards = () => {
    const { gameState } = useGame();
    const { categories } = gameState;

    // Calculate total XP as placeholder "gold" currency
    const totalXp = Object.values(categories).reduce((sum, cat) => sum + (cat.xp || 0), 0);

    return (
        <div className="min-h-screen bg-[#0a0e1a] p-4 md:p-8 pb-32 text-white overflow-y-auto">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6 flex items-center justify-center gap-3">
                    <Gift className="w-8 h-8 text-amber-400" />
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Recompensas
                    </h1>
                </div>

                {/* Currency Display */}
                <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-5 mb-6 flex items-center justify-between">
                    <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Tu Oro</span>
                        <div className="flex items-center gap-2 mt-1">
                            <Coins className="w-6 h-6 text-amber-400" />
                            <span className="text-3xl font-black text-amber-400">{totalXp}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Canjeadas</span>
                        <p className="text-2xl font-black text-gray-400 mt-1">0</p>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <ShoppingBag className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-200/70">
                        Gana oro completando misiones. Canjea recompensas para potenciar tu aventura.
                        <span className="text-amber-400 font-semibold"> Próximamente.</span>
                    </p>
                </div>

                {/* Rewards Grid */}
                <div className="space-y-3">
                    {SAMPLE_REWARDS.map((reward) => {
                        const colors = COLOR_MAP[reward.color] || COLOR_MAP.amber;
                        const Icon = reward.icon;
                        const canAfford = totalXp >= reward.cost;

                        return (
                            <div
                                key={reward.id}
                                className={`bg-gray-900 border border-white/[0.06] border-l-4 ${colors.border} rounded-xl p-4 flex items-center gap-4 opacity-70`}
                            >
                                {/* Icon */}
                                <div className={`p-3 rounded-lg ${colors.bg}`}>
                                    <Icon className={`w-6 h-6 ${colors.text}`} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white text-base">{reward.title}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">{reward.description}</p>
                                </div>

                                {/* Cost / Action */}
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <div className="flex items-center gap-1">
                                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-sm font-bold text-amber-400">{reward.cost}</span>
                                    </div>
                                    <button
                                        disabled
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-500 text-xs font-bold cursor-not-allowed"
                                    >
                                        <Lock className="w-3 h-3" />
                                        Pronto
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Rewards;
