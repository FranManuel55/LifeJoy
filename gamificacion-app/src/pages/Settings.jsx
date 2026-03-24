import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ChevronRight, LogOut, Layers } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_CONFIG } from '../utils/constants';

const COLOR_VARIANTS = {
    blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', toggle: 'bg-blue-500', icon: 'text-blue-500' },
    red: { bg: 'bg-red-500/15', text: 'text-red-400', toggle: 'bg-red-500', icon: 'text-red-500' },
    amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', toggle: 'bg-amber-500', icon: 'text-amber-500' },
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', toggle: 'bg-emerald-500', icon: 'text-emerald-500' },
    violet: { bg: 'bg-violet-500/15', text: 'text-violet-400', toggle: 'bg-violet-500', icon: 'text-violet-500' },
    cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', toggle: 'bg-cyan-500', icon: 'text-cyan-500' },
    gray: { bg: 'bg-gray-800', text: 'text-gray-400', toggle: 'bg-gray-700', icon: 'text-gray-500' }
};

const Settings = () => {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('main');

    const gameContext = useGame();
    const { logout } = useAuth();

    if (!gameContext) {
        return (
            <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center">
                <p>Error: Game Context Not Loaded</p>
            </div>
        );
    }

    const { gameState, toggleCategory } = gameContext;
    const categories = gameState?.categories || {};

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const goBack = () => {
        if (currentView === 'categories') {
            setCurrentView('main');
        } else {
            navigate('/');
        }
    };

    const renderMainMenu = () => (
        <div className="space-y-3 animate-fade-in">
            <button
                onClick={() => setCurrentView('categories')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-900 border border-white/[0.06] hover:bg-gray-800 transition-all group"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-violet-500/15 text-violet-400 group-hover:scale-105 transition-transform">
                        <Layers size={22} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-white">Áreas de Vida</h3>
                        <p className="text-sm text-gray-500">Activa o desactiva tus categorías</p>
                    </div>
                </div>
                <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-red-950/30 border border-red-900/30 hover:bg-red-950/50 transition-all group mt-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-red-500/15 text-red-500 group-hover:scale-105 transition-transform">
                        <LogOut size={22} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-base font-bold text-red-400">Cerrar Sesión</h3>
                        <p className="text-sm text-red-300/40">Salir de tu cuenta actual</p>
                    </div>
                </div>
            </button>
        </div>
    );

    const renderCategories = () => (
        <div className="space-y-3 animate-fade-in">
            <div className="mb-5 p-4 rounded-xl bg-blue-950/30 border border-blue-900/30 flex gap-3">
                <span className="text-lg">💡</span>
                <p className="text-blue-200/70 text-sm leading-relaxed">
                    Desactivar una categoría ocultará sus misiones, pero
                    <span className="font-bold text-white"> NO borrará tu progreso</span>.
                </p>
            </div>

            {Object.entries(categories).map(([key, data]) => {
                const config = CATEGORY_CONFIG[key];
                if (!config) return null;

                const isActive = data.isActive !== false;
                const Icon = config.icon || Check;
                const colorKey = config.color || 'gray';
                const styles = COLOR_VARIANTS[colorKey] || COLOR_VARIANTS.gray;

                return (
                    <div
                        key={key}
                        onClick={() => toggleCategory(key)}
                        className={`
                            group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer
                            ${isActive
                                ? 'bg-gray-900 border-white/[0.06] hover:bg-gray-800'
                                : 'bg-gray-950 border-white/[0.03] opacity-50 hover:opacity-70'
                            }
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg transition-colors ${styles.bg} ${styles.text}`}>
                                {Icon && <Icon size={18} />}
                            </div>
                            <h3 className={`font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                {config.label || data.label}
                            </h3>
                        </div>

                        <div className={`w-11 h-6 rounded-full transition-colors relative ${isActive ? styles.toggle : 'bg-gray-700'}`}>
                            <div className={`
                                absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center
                                ${isActive ? 'translate-x-5' : 'translate-x-0'}
                            `}>
                                {isActive ? <Check size={10} className={styles.icon} /> : <X size={10} className="text-gray-500" />}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0e1a] p-6 pb-32">
            {/* Header */}
            <div className="max-w-md mx-auto mb-6 flex items-center relative">
                <button
                    onClick={goBack}
                    className="absolute left-0 p-2.5 rounded-lg bg-gray-900 border border-white/[0.06] hover:bg-gray-800 transition-colors z-10"
                >
                    <ArrowLeft className="text-white w-5 h-5" />
                </button>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-bold text-white">
                        {currentView === 'main' ? 'Configuración' : 'Áreas'}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-md mx-auto">
                {currentView === 'main' ? renderMainMenu() : renderCategories()}
            </div>
        </div>
    );
};

export default Settings;
